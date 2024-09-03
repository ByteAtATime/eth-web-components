import { css } from "lit";

export default css`
  button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: var(--copy-icon-color, currentColor);
  }

  svg {
    width: var(--copy-icon-size, 1rem);
    height: var(--copy-icon-size, 1rem);
    stroke: currentColor;
  }
`;
