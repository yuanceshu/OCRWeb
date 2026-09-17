import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// Node's built-in modules are used only by the static guide publishing plugin.
// @ts-ignore The project does not otherwise depend on @types/node.
import fs from "node:fs";
// @ts-ignore The project does not otherwise depend on @types/node.
import path from "node:path";

const guideSourcePath = path.resolve(
  ".",
  "docs-source/OCR模型自训练全流程操作指南.html",
);

function publishInterfaceCustomGuide() {
  return {
    name: "publish-interface-custom-guide",
    configureServer(server: { middlewares: { use: (handler: (request: any, response: any, next: () => void) => void) => void } }) {
      server.middlewares.use((request, response, next) => {
        const pathname = request.url?.split("?", 1)[0];
        if (pathname !== "/interface-custom-guide" && pathname !== "/interface-custom-guide/") {
          next();
          return;
        }

        response.statusCode = 200;
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(fs.readFileSync(guideSourcePath));
      });
    },
    generateBundle(this: { emitFile: (asset: { type: "asset"; fileName: string; source: string | Uint8Array }) => void }) {
      this.emitFile({
        type: "asset",
        fileName: "interface-custom-guide/index.html",
        source: fs.readFileSync(guideSourcePath),
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), publishInterfaceCustomGuide()],
});
