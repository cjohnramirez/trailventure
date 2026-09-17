// Runs the standalone build the same way the Docker image does:
// copy static assets next to server.js, then start it.
import { cpSync, existsSync } from "node:fs";
import { spawn } from "node:child_process";

const standalone = ".next/standalone";
if (!existsSync(`${standalone}/server.js`)) {
  console.error("No standalone build found. Run `npm run build` first.");
  process.exit(1);
}

cpSync(".next/static", `${standalone}/.next/static`, { recursive: true });
cpSync("public", `${standalone}/public`, { recursive: true });

const server = spawn(process.execPath, ["server.js"], {
  cwd: standalone,
  stdio: "inherit",
  env: { ...process.env, PORT: process.env.PORT ?? "3000", HOSTNAME: "0.0.0.0" },
});
server.on("exit", (code) => process.exit(code ?? 0));
