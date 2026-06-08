import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ["./src/index.ts"],
  dts: true,
  format: ['esm', 'cjs'],
  platform: "node",
  // Build runs on Node 22+ (tsdown requirement) but the bundled output
  // targets Node 20 so the published package still supports it at runtime.
  target: "node20",
  sourcemap: true,
  exports: true,
  clean: true,
  deps: {
    skipNodeModulesBundle: true
  }
})
