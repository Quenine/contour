import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["**/dist/**", "**/node_modules/**", "**/.next/**", "**/coverage/**"] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({ ...config, files: ["**/*.ts"] })),
  {
    files: ["**/*.ts"],
    languageOptions: { parserOptions: { project: ["./apps/web/tsconfig.lint.json", "./tsconfig.eslint.json"], tsconfigRootDir: import.meta.dirname } },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error"
    }
  }
);
