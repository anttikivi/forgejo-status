import { defineConfig } from "rolldown";
import { minify } from "rollup-plugin-esbuild";

export default defineConfig([
  {
    input: "src/index.ts",
    platform: "node",
    tsconfig: "tsconfig.json",
    plugins: [minify()],
    output: {
      file: "dist/index.js",
      format: "esm",
    },
  },
  {
    input: "src/post.ts",
    platform: "node",
    tsconfig: "tsconfig.json",
    plugins: [minify()],
    output: {
      file: "dist/post.js",
      format: "esm",
    },
  },
]);
