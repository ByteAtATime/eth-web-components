import { css } from "lit";

export default css`
  :host {
    display: flex;
  }

  img {
    width: var(--avatar-size, 3rem);
    height: var(--avatar-size, 3rem);
    overflow: hidden;
    border-radius: 50%;

    border-color: var(--avatar-border-color, #000);
    border-width: var(--avatar-border-width, 0);
    border-style: var(--avatar-border-style, solid);
  }
`;
