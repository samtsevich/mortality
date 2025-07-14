module.exports = {
  extends: ["@raycast/eslint-config"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
  },
};
