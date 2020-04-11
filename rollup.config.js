import OMT from "@surma/rollup-plugin-off-main-thread";
import rollupTypescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";

//  input: {
//         foo: "Cargo.toml",
//     },

export default {
  input: ["ts/main.ts"],
  output: {
    dir: "dist",
    // You _must_ use either “amd” or “esm” as your format.
    // But note that only very few browsers have native support for
    // modules in workers.
    format: "esm",
  },
  plugins: [
    replace({
      [`import.meta.url`]: `"bla"`,
      //   include: "*.js",
    }),
    resolve(),
    OMT(),
    rollupTypescript(),
  ],
};
