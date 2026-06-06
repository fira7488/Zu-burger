const http = require("http");
const fs = require("fs/promises");
const path = require("path");

const PORT = Number(process.env.PORT || 5000);
const rootDir = path.join(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const ordersFile = path.join(__dirname, "data", "orders.json");

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
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(body));
}

async function readOrders() {
  try {
    return JSON.parse(await fs.readFile(ordersFile, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function writeOrders(orders) {
  await fs.mkdir(path.dirname(ordersFile), { recursive: true });
  await fs.writeFile(ordersFile, `${JSON.stringify(orders, null, 2)}\n`);
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

async function handleApi(req, res, url) {
  if (req.method === "OPTIONS") {
    return sendJson(res, 204, {});
  }

  if (req.method === "GET" && url.pathname === "/api/health") {
    return sendJson(res, 200, { ok: true, service: "zu-burger-spot-api" });
  }

  if (req.method === "GET" && url.pathname === "/api/orders") {
    const orders = await readOrders();
    return sendJson(res, 200, orders);
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
    } catch (error) {
      return sendJson(res, 400, {
        ok: false,
        error: "Could not process order.",
      });
    }
  }

  if (req.method === "PATCH" && url.pathname.startsWith("/api/orders/")) {
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
  } catch (error) {
    sendJson(res, 500, { ok: false, error: "Internal server error." });
  }
});

server.listen(PORT, () => {
  console.log(`Zu Burger Spot server running at http://localhost:${PORT}`);
});
