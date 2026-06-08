import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ["./src/index.ts"],
  dts: true,
  format: ['esm', 'cjs'],
  platform: "node",
  sourcemap: true,
  exports: true,
  clean: true,
  deps: {
    skipNodeModulesBundle: true
  }
})
