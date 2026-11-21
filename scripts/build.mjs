// Vercel build: copy static files to dist/ and write config.js from env FIREBASE_CONFIG (JSON)
import { mkdirSync, copyFileSync, writeFileSync, cpSync } from "node:fs";
mkdirSync("dist", { recursive: true });
copyFileSync("index.html", "dist/index.html");
cpSync("img", "dist/img", { recursive: true });
cpSync("vendor", "dist/vendor", { recursive: true });
const raw = (process.env.FIREBASE_CONFIG || "").trim();
if (raw) {
  let cfg;
  try { cfg = JSON.parse(raw); } catch (e) {
    // accept the JS object literal copied from Firebase console: { apiKey: "..", ... }
    cfg = Function('"use strict";return (' + raw.replace(/^const\s+\w+\s*=\s*/, "").replace(/;\s*$/, "") + ")")();
  }
  if (!cfg || !cfg.projectId) throw new Error("FIREBASE_CONFIG must include projectId");
  writeFileSync("dist/config.js", "window.FIREBASE_CONFIG = " + JSON.stringify(cfg) + ";\n");
  console.log("config.js written from FIREBASE_CONFIG (project " + cfg.projectId + ")");
} else {
  copyFileSync("config.js", "dist/config.js");
  console.log("FIREBASE_CONFIG not set — using repo config.js");
}
