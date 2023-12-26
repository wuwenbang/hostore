import resolve from "@rollup/plugin-node-resolve";
import cjs from "@rollup/plugin-commonjs";
import ts from "@rollup/plugin-typescript";
import generatePackageJson from "rollup-plugin-generate-package-json";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";

const unpkgRollupConfig = {
  input: "./index.ts",
  output: {
    name: "hook-store",
    file: "dist/index.min.js",
    format: "umd",
  },
  external: ["react", "react/jsx-runtime"],
  plugins: [
    resolve(),
    babel({
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
      exclude: "node_modules/**",
      babelHelpers: "bundled",
      presets: ["@babel/env", "@babel/preset-react"],
    }),
    terser(),
    cjs(),
    ts(),
    generatePackageJson({
      inputFolder: "./",
      outputFolder: "./dist/",
      baseContents: (pkg) => pkg,
    }),
  ],
};

const mainRollupConfig = {
  input: "./index.ts",
  output: [
    {
      file: "dist/index.cjs.js",
      format: "umd",
      name: "hook-store",
    },
    {
      file: "dist/index.es.js",
      format: "es",
    },
  ],
  external: ["react", "react/jsx-runtime"],
  plugins: [
    resolve(),
    babel({
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
      exclude: "node_modules/**",
      babelHelpers: "bundled",
      presets: ["@babel/env", "@babel/preset-react"],
    }),
    cjs(),
    ts(),
    generatePackageJson({
      inputFolder: "./",
      outputFolder: "./dist/",
      baseContents: (pkg) => pkg,
    }),
  ],
};

export default [mainRollupConfig, unpkgRollupConfig];
