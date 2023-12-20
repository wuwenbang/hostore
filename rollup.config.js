import path from "path";
import resolve from "@rollup/plugin-node-resolve";
import cjs from "@rollup/plugin-commonjs";
import ts from "rollup-plugin-typescript2";

const inputPath = path.resolve(__dirname, "./index.ts");
const outputPath = path.resolve(__dirname, "./dist/index.js");

export default {
  input: inputPath,
  output: {
    file: outputPath,
    format: "umd",
    name: "hook-store",
  },
  external: ["react"],
  plugins: [resolve(), ts(), cjs()],
};
