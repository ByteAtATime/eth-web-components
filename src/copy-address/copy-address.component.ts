import { customElement, property, state } from "lit/decorators.js";
import { html, LitElement } from "lit";
import copyAddressStyle from "~/copy-address/copy-address.style.ts";
import { Address } from "viem";
import { copyIcon, copySuccessIcon } from "~/copy-address/copy-icons.ts";

@customElement("copy-address")
export class CopyAddressComponent extends LitElement {
  static styles = copyAddressStyle;

  @property()
  address!: Address;

  @state()
  addressCopied = false;

  render() {
    const buttonImage = this.addressCopied ? copySuccessIcon : copyIcon;

    return html`<button @click=${this.copyAddress}>${buttonImage}</button>`;
  }

  private async copyAddress() {
    await navigator.clipboard.writeText(this.address);
    this.addressCopied = true;
    setTimeout(() => {
      this.addressCopied = false;
    }, 1_500);
  }
}
