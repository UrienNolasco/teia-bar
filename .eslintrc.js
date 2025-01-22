module.exports = {
  extends: "next/core-web-vitals",
  rules: {
    "no-unused-vars": "error", // Mantém o erro para variáveis não usadas
    "@typescript-eslint/no-explicit-any": "off", // Desativa o erro de uso do 'any'
    "no-var": "error", // Garante que 'var' não seja usado
    "@typescript-eslint/no-require-imports": "off", // Permite o uso de 'require'
    "no-undef": "off", // Desativa erro de '__dirname' e outros
    "react/react-in-jsx-scope": "off", // Desativa a exigência de React estar em escopo
  },
  settings: {
    react: {
      version: "^19.0.0",
    },
  },
};
