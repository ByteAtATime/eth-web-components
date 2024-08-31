import { customElement, property } from "lit/decorators.js";
import { html, LitElement } from "lit";
import addressDetailsStyle from "~/address-details/address-details.style.ts";
import { openExplorerIcon } from "~/address-details/explorer-icon.ts";

@customElement("address-details")
export class AddressDetailsComponent extends LitElement {
  @property()
  address!: string;
  @property()
  addressStyle: "long" | "short" = "short";
  @property()
  ensName: string | null | undefined = null;
  @property()
  blockExplorerBaseUrl: string | null = null;

  static styles = addressDetailsStyle;

  render() {
    const displayAddress =
      this.addressStyle === "long"
        ? this.address
        : this.address.slice(0, 6) + "..." + this.address.slice(-4);

    const blockExplorerUrl = `${this.blockExplorerBaseUrl ?? "https://etherscan.io"}/address/${this.address}`;

    const copyAddress = html`<copy-address
      .address=${this.address}
    ></copy-address>`;
    const openExplorer = html`
      <a href=${blockExplorerUrl} target="_blank" rel="noopener noreferrer">
        ${openExplorerIcon}
      </a>
    `;

    const title = html`<p>
      ${this.ensName ?? displayAddress} ${this.ensName ? null : copyAddress}
      ${openExplorer}
    </p>`;
    const description = this.ensName
      ? html`<span> ${displayAddress} ${copyAddress} </span>`
      : null;

    return html`<div>${title} ${description}</div>`;
  }
}
