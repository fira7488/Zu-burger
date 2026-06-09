import { spawn } from "node:child_process";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_API_PORT = 5000;

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const tester = net
      .createServer()
      .once("error", () => resolve(false))
      .once("listening", () => {
        tester.close(() => resolve(true));
      })
      .listen(port);
  });
}

async function findAvailablePort(startPort) {
  let port = startPort;
  while (!(await isPortAvailable(port))) {
    port += 1;
    if (port > startPort + 20) {
      throw new Error(`No free port found near ${startPort}.`);
    }
  }
  return port;
}

const apiPort = await findAvailablePort(DEFAULT_API_PORT);
if (apiPort !== DEFAULT_API_PORT) {
  console.warn(
    `Port ${DEFAULT_API_PORT} is in use. Starting API on port ${apiPort} instead.`,
  );
  console.warn(
    "If an old dev server is still running, stop it with Ctrl+C in that terminal.",
  );
}

const sharedEnv = {
  ...process.env,
  PORT: String(apiPort),
  API_PORT: String(apiPort),
};

const commands = [
  ["api", process.execPath, ["server/server.js"]],
  [
    "web",
    process.execPath,
    ["node_modules/vite/bin/vite.js", "--host", "0.0.0.0"],
  ],
];

const children = commands.map(([name, command, args]) => {
  const child = spawn(command, args, {
    cwd: rootDir,
    stdio: "inherit",
    shell: false,
    env: sharedEnv,
  });
  child.on("exit", (code) => {
    if (code && code !== 0) {
      console.error(`${name} exited with code ${code}`);
      process.exitCode = code;
    }
  });
  return child;
});

function shutdown() {
  for (const child of children) {
    child.kill();
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
