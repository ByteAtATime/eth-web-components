import { customElement, property, state } from "lit/decorators.js";
import { html, LitElement } from "lit";
import copyAddress from "./copy.svg";
import copyAddressSuccess from "./copy-success.svg";
import copyAddressStyle from "~/copy-address/copy-address.style.ts";
import { Address } from "viem";

@customElement("copy-address")
export class CopyAddressComponent extends LitElement {
  static styles = copyAddressStyle;

  @property()
  address!: Address;

  @state()
  addressCopied = false;

  render() {
    const buttonImage = this.addressCopied ? copyAddressSuccess : copyAddress;
    const buttonAlt = this.addressCopied ? "Address copied" : "Copy address";

    return html`<button @click=${this.copyAddress}>
      <img alt=${buttonAlt} src=${buttonImage} />
    </button>`;
  }

  private async copyAddress() {
    await navigator.clipboard.writeText(this.address);
    this.addressCopied = true;
    setTimeout(() => {
      this.addressCopied = false;
    }, 1_500);
  }
}
