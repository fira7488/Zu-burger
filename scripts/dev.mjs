import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const commands = [
  ["api", process.execPath, ["server/server.js"]],
  ["web", process.execPath, ["node_modules/vite/bin/vite.js", "--host", "0.0.0.0"]]
];

const children = commands.map(([name, command, args]) => {
  const child = spawn(command, args, {
    cwd: rootDir,
    stdio: "inherit",
    shell: false
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
