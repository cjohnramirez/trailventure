import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // shadcn's current preset emits `import { cn } from "cn"`; that npm package is unrelated.
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        { paths: [{ name: "cn", message: 'Import { cn } from "@/lib/utils" instead.' }] },
      ],
    },
  },
  {
    // shadcn policy: app code uses components/ui, never raw primitives.
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/components/ui/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            { name: "radix-ui", message: "Import from @/components/ui instead." },
            { name: "cn", message: 'Import { cn } from "@/lib/utils" instead.' },
          ],
          patterns: [{ group: ["@radix-ui/*"], message: "Import from @/components/ui instead." }],
        },
      ],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
