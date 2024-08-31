import { css } from "lit";

export default css`
  div {
    display: flex;
    align-items: center;
    column-gap: var(--gap, 0.5rem);
    font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; // Tailwind font stack
  }
`;
