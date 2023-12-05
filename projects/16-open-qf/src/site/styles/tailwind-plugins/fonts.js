const plugin = require("tailwindcss/plugin");

module.exports = plugin(({ addComponents }) => {
  addComponents({
    ".text64bold": {
      "font-family": "var(--font-montserrat)",
      "font-size": "64px",
      "font-weight": "700",
      "line-height": "64px",
      "letter-spacing": "0",
    },
    ".text36bold": {
      "font-family": "var(--font-montserrat)",
      "font-size": "36px",
      "font-weight": "700",
      "line-height": "36px",
      "letter-spacing": "0",
    },
    ".text24bold": {
      "font-family": "var(--font-montserrat)",
      "font-size": "24px",
      "font-weight": "700",
      "line-height": "24px",
      "letter-spacing": "0",
    },
    ".text24semibold": {
      "font-family": "var(--font-inter)",
      "font-size": "24px",
      "font-weight": "600",
      "line-height": "36px",
      "letter-spacing": "0",
    },
    ".text20semibold": {
      "font-family": "var(--font-inter)",
      "font-size": "20px",
      "font-weight": "600",
      "line-height": "32px",
      "letter-spacing": "0",
    },
    ".text18semibold": {
      "font-family": "var(--font-inter)",
      "font-size": "18px",
      "font-weight": "600",
      "line-height": "28px",
      "letter-spacing": "0",
    },
    ".text16semibold": {
      "font-family": "var(--font-inter)",
      "font-size": "16px",
      "font-weight": "600",
      "line-height": "24px",
      "letter-spacing": "0",
    },
    ".text15medium": {
      "font-family": "var(--font-inter)",
      "font-size": "15px",
      "font-weight": "500",
      "line-height": "24px",
      "letter-spacing": "0",
    },
    ".text14semibold": {
      "font-family": "var(--font-inter)",
      "font-size": "14px",
      "font-weight": "600",
      "line-height": "20px",
      "letter-spacing": "0",
    },
    ".text14medium": {
      "font-family": "var(--font-inter)",
      "font-size": "14px",
      "font-weight": "500",
      "line-height": "20px",
      "letter-spacing": "0",
    },
    ".text12medium": {
      "font-family": "var(--font-inter)",
      "font-size": "12px",
      "font-weight": "500",
      "line-height": "16px",
      "letter-spacing": "0",
    },
  });
});
