import { css } from "lit";

export default css`
  div {
    display: flex;
    flex-direction: column;
    row-gap: var(--details-gap, 0.25rem);
  }

  p,
  span {
    display: flex;
    align-items: center;
    column-gap: var(--details-gap, 0.25rem);
  }

  p {
    margin: 0;
    font-weight: bold;
    font-size: var(--title-font-size, 1rem);
  }

  a {
    color: inherit;
    text-decoration: inherit;
  }

  span {
    font-size: var(--address-font-size, 0.875rem);
  }
`;
