import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

const plugins = [commonjs(), nodeResolve({ preferBuiltins: true }), terser()];

const output = {
  esModule: true,
  format: "es",
  sourcemap: false,
};

export default [
  {
    input: "src/index.js",
    output: { ...output, file: "dist/index.js" },
    plugins,
  },
  {
    input: "src/post.js",
    output: { ...output, file: "dist/post.js" },
    plugins,
  },
];
