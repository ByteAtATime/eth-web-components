import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { blo } from "blo";
import { Address } from "viem";
import ensAvatarStyle from "~/ens-avatar/ens-avatar.style.ts";

@customElement("ens-avatar")
export class EnsAvatarComponent extends LitElement {
  @property()
  avatarUri: string | null | undefined = null;
  /** Fallback address to use if no avatarUri is provided (displays address blockie) */
  @property()
  address!: Address;

  static styles = ensAvatarStyle;

  render() {
    const avatarSrc = this.avatarUri ?? blo(this.address);

    return html`<img src=${avatarSrc} alt="User avatar" /> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ens-avatar": EnsAvatarComponent;
  }
}
