const crypto = require("crypto");
const http = require("http");
const fs = require("fs/promises");
const path = require("path");

const PORT = Number(process.env.PORT || 5000);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ZuBurgerAdmin2026!";
const rootDir = path.join(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const ordersFile = path.join(__dirname, "data", "orders.json");
const menuFile = path.join(__dirname, "data", "menu.json");

const adminTokens = new Set();

const defaultMenu = [
  {
    id: "zu-family-stack",
    name: "Zu Family Stack",
    category: "Signature Burgers",
    description:
      "Double beef patties, cheddar, caramelized onion, lettuce, tomato, and Zu house sauce.",
    price: 780,
    featured: true,
    available: true,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "addis-smoke-burger",
    name: "Shashemene Smoke Burger",
    category: "Signature Burgers",
    description:
      "Flame-grilled beef, smoked cheese, crispy onions, pickles, and warm barbecue glaze.",
    price: 720,
    featured: true,
    available: true,
    image:
      "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "classic-cheese",
    name: "Classic Cheese Burger",
    category: "Beef Burgers",
    description:
      "Juicy beef patty, melted cheddar, lettuce, tomato, onion, pickles, and signature mayo.",
    price: 590,
    featured: true,
    available: true,
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "spicy-beef-crunch",
    name: "Spicy Beef Crunch",
    category: "Beef Burgers",
    description:
      "Seasoned beef, pepper jack cheese, jalapeno relish, crunchy onions, and chili aioli.",
    price: 640,
    featured: false,
    available: true,
    image:
      "https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "crispy-chicken-deluxe",
    name: "Crispy Chicken Deluxe",
    category: "Chicken Burgers",
    description:
      "Golden fried chicken breast, slaw, tomato, pickles, and honey mustard dressing.",
    price: 560,
    featured: true,
    available: true,
    image:
      "https://images.unsplash.com/photo-1615297928064-24977384d0da?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "peri-chicken",
    name: "Peri Chicken Burger",
    category: "Chicken Burgers",
    description:
      "Grilled chicken, peri sauce, lettuce, grilled peppers, and cool herb yogurt.",
    price: 540,
    featured: false,
    available: true,
    image:
      "https://images.unsplash.com/photo-1606755962773-d324e2dabd11?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "garden-gold",
    name: "Garden Gold Burger",
    category: "Vegan Burgers",
    description:
      "Plant-based patty, avocado, tomato relish, crisp lettuce, and vegan golden sauce.",
    price: 520,
    featured: false,
    available: true,
    image:
      "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "mushroom-vegan",
    name: "Mushroom Melt Vegan",
    category: "Vegan Burgers",
    description:
      "Grilled mushroom patty, vegan cheese, arugula, onions, and garlic tahini.",
    price: 550,
    featured: false,
    available: true,
    image:
      "https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "loaded-fries",
    name: "Loaded Zu Fries",
    category: "Fries & Sides",
    description:
      "Crispy fries topped with cheese sauce, herbs, onions, and smoky Zu drizzle.",
    price: 280,
    featured: false,
    available: true,
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "onion-rings",
    name: "Golden Onion Rings",
    category: "Fries & Sides",
    description:
      "Thick-cut onion rings with a crunchy golden coating and creamy dip.",
    price: 240,
    featured: false,
    available: true,
    image:
      "https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "mango-fizz",
    name: "Mango Fizz",
    category: "Drinks",
    description:
      "Bright mango soda with citrus, mint, and a cold sparkling finish.",
    price: 160,
    featured: false,
    available: true,
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "strawberry-shake",
    name: "Strawberry Shake",
    category: "Drinks",
    description:
      "Creamy strawberry milkshake finished with whipped cream and berry sauce.",
    price: 220,
    featured: false,
    available: true,
    image:
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=85",
  },
];

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
};

function sendJson(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  res.end(JSON.stringify(body));
}

function getBearerToken(req) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  return scheme === "Bearer" && token ? token : null;
}

function requireAdmin(req, res) {
  const token = getBearerToken(req);
  if (!token || !adminTokens.has(token)) {
    sendJson(res, 401, { ok: false, error: "Admin authentication required." });
    return false;
  }
  return true;
}

async function readJsonFile(filePath, fallback) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return fallback;
    throw error;
  }
}

async function writeJsonFile(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

async function readOrders() {
  return readJsonFile(ordersFile, []);
}

async function writeOrders(orders) {
  await writeJsonFile(ordersFile, orders);
}

async function readMenu() {
  const menu = await readJsonFile(menuFile, null);
  if (!menu) {
    await writeJsonFile(menuFile, defaultMenu);
    return defaultMenu;
  }
  return menu;
}

async function writeMenu(menu) {
  await writeJsonFile(menuFile, menu);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Payload too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function validateOrder(order) {
  if (!order || typeof order !== "object") return "Invalid order payload.";
  if (!order.id || typeof order.id !== "string")
    return "Order must include an id.";
  if (
    !order.customer ||
    !order.customer.name ||
    !order.customer.phone ||
    !order.customer.address
  ) {
    return "Customer name, phone, and address are required.";
  }
  if (!Array.isArray(order.items) || order.items.length === 0) {
    return "Order must include at least one item.";
  }
  if (typeof order.total !== "number") {
    return "Order total must be a number.";
  }
  return null;
}

function validateMenuItem(item) {
  if (!item?.id || !item?.name) return "Menu item must include id and name.";
  if (typeof item.price !== "number" || item.price < 0) {
    return "Price must be a non-negative number.";
  }
  return null;
}

async function handleApi(req, res, url) {
  if (req.method === "OPTIONS") {
    return sendJson(res, 204, {});
  }

  if (req.method === "GET" && url.pathname === "/api/health") {
    return sendJson(res, 200, { ok: true, service: "zu-burger-spot-api" });
  }

  if (req.method === "POST" && url.pathname === "/api/admin/login") {
    try {
      const payload = JSON.parse(await readBody(req));
      const password = String(payload.password || "");
      if (password !== ADMIN_PASSWORD) {
        return sendJson(res, 401, { ok: false, error: "Invalid staff password." });
      }
      const token = crypto.randomBytes(32).toString("hex");
      adminTokens.add(token);
      return sendJson(res, 200, { ok: true, token });
    } catch {
      return sendJson(res, 400, { ok: false, error: "Invalid login request." });
    }
  }

  if (req.method === "GET" && url.pathname === "/api/menu") {
    const menu = await readMenu();
    return sendJson(res, 200, menu);
  }

  if (req.method === "POST" && url.pathname === "/api/menu") {
    if (!requireAdmin(req, res)) return;
    try {
      const item = JSON.parse(await readBody(req));
      const validationError = validateMenuItem(item);
      if (validationError) {
        return sendJson(res, 400, { ok: false, error: validationError });
      }
      const menu = await readMenu();
      if (menu.some((entry) => entry.id === item.id)) {
        return sendJson(res, 409, { ok: false, error: "Item id already exists." });
      }
      const nextMenu = [...menu, { ...item, available: item.available !== false }];
      await writeMenu(nextMenu);
      return sendJson(res, 201, { ok: true, item });
    } catch {
      return sendJson(res, 400, { ok: false, error: "Could not create menu item." });
    }
  }

  if (url.pathname.startsWith("/api/menu/")) {
    const itemId = url.pathname.replace("/api/menu/", "");

    if (req.method === "PUT") {
      if (!requireAdmin(req, res)) return;
      try {
        const updates = JSON.parse(await readBody(req));
        const validationError = validateMenuItem({ ...updates, id: itemId });
        if (validationError) {
          return sendJson(res, 400, { ok: false, error: validationError });
        }
        const menu = await readMenu();
        let updated = false;
        const nextMenu = menu.map((item) => {
          if (item.id === itemId) {
            updated = true;
            return { ...item, ...updates, id: itemId };
          }
          return item;
        });
        if (!updated) {
          return sendJson(res, 404, { ok: false, error: "Menu item not found." });
        }
        await writeMenu(nextMenu);
        return sendJson(res, 200, { ok: true });
      } catch {
        return sendJson(res, 400, { ok: false, error: "Could not update menu item." });
      }
    }

    if (req.method === "DELETE") {
      if (!requireAdmin(req, res)) return;
      const menu = await readMenu();
      const nextMenu = menu.filter((item) => item.id !== itemId);
      if (nextMenu.length === menu.length) {
        return sendJson(res, 404, { ok: false, error: "Menu item not found." });
      }
      await writeMenu(nextMenu);
      return sendJson(res, 200, { ok: true });
    }
  }

  if (req.method === "GET" && url.pathname === "/api/orders") {
    if (!requireAdmin(req, res)) return;
    const orders = await readOrders();
    return sendJson(res, 200, orders);
  }

  if (req.method === "GET" && url.pathname.startsWith("/api/orders/")) {
    const orderId = url.pathname.replace("/api/orders/", "");
    const orders = await readOrders();
    const order = orders.find((entry) => entry.id === orderId);
    if (!order) {
      return sendJson(res, 404, { ok: false, error: "Order not found." });
    }
    return sendJson(res, 200, order);
  }

  if (req.method === "POST" && url.pathname === "/api/orders") {
    try {
      const payload = JSON.parse(await readBody(req));
      const validationError = validateOrder(payload);
      if (validationError) {
        return sendJson(res, 400, { ok: false, error: validationError });
      }

      const orders = await readOrders();
      const order = {
        ...payload,
        submittedAt: new Date().toISOString(),
      };
      await writeOrders([order, ...orders]);

      return sendJson(res, 201, {
        ok: true,
        orderId: order.id,
        message: "Order received.",
      });
    } catch {
      return sendJson(res, 400, {
        ok: false,
        error: "Could not process order.",
      });
    }
  }

  if (req.method === "PATCH" && url.pathname.startsWith("/api/orders/")) {
    if (!requireAdmin(req, res)) return;
    try {
      const orderId = url.pathname.replace("/api/orders/", "");
      const payload = JSON.parse(await readBody(req));
      const status = String(payload.status || "").trim();
      if (!status) {
        return sendJson(res, 400, { ok: false, error: "Status is required." });
      }

      const orders = await readOrders();
      let updated = false;
      const nextOrders = orders.map((order) => {
        if (order.id === orderId) {
          updated = true;
          return { ...order, status };
        }
        return order;
      });

      if (!updated) {
        return sendJson(res, 404, { ok: false, error: "Order not found." });
      }

      await writeOrders(nextOrders);
      return sendJson(res, 200, { ok: true });
    } catch {
      return sendJson(res, 400, {
        ok: false,
        error: "Could not update order status.",
      });
    }
  }

  return sendJson(res, 404, { ok: false, error: "API route not found." });
}

async function serveStatic(req, res, url) {
  const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
  const decodedPath = decodeURIComponent(requestedPath).replace(/^[/\\]+/, "");
  const safePath = path.normalize(decodedPath).replace(/^(\.\.[/\\])+/g, "");
  let filePath = path.join(distDir, safePath);

  try {
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }
  } catch {
    filePath = path.join(distDir, "index.html");
  }

  try {
    const ext = path.extname(filePath);
    const content = await fs.readFile(filePath);
    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
    });
    res.end(content);
  } catch {
    sendJson(res, 404, {
      ok: false,
      error: "Build output not found. Run npm run build first.",
    });
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
      return;
    }
    await serveStatic(req, res, url);
  } catch {
    sendJson(res, 500, { ok: false, error: "Internal server error." });
  }
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Stop the other process or set PORT to a free port.`,
    );
    process.exit(1);
  }
  console.error("Server failed to start:", error.message);
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`Zu Burger Spot server running at http://localhost:${PORT}`);
});
