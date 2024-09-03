import { Config, getAccount } from "@wagmi/core";
import { LitElement, PropertyValues, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Address, getAddress } from "viem";
import addressDisplayStyle from "~/address-display/address-display.style.ts";
import { IWagmiProvider, WagmiProvider } from "~~/wagmi-provider.ts";

@customElement("address-display")
export class AddressDisplayComponent extends LitElement {
  private _address: Address | null = null;

  @property()
  set address(val: Address | null) {
    this._address = val ? getAddress(val) : val;
  }

  get address() {
    return this._address;
  }

  @property()
  wagmiConfig: Config | null = null;
  @property()
  wagmiProvider: IWagmiProvider | null = null;
  @property()
  addressStyle: "long" | "short" = "short";
  @property({ type: Boolean })
  clickable = false;

  @state()
  private ensName: string | null | undefined = null;
  @state()
  private ensAvatar: string | null | undefined = null;

  static styles = addressDisplayStyle;

  updated(changedProperties: PropertyValues<this>) {
    const shouldUpdateEns =
      changedProperties.has("address") || changedProperties.has("wagmiConfig");
    if (shouldUpdateEns && this.address && this.wagmiConfig) {
      this.ensName = undefined;

      this.updateEnsData().then();
    }

    if (changedProperties.has("wagmiConfig")) {
      if (!this.wagmiConfig) return;

      if (this.wagmiProvider) {
        this.wagmiProvider.updateConfig(this.wagmiConfig);
      } else {
        this.wagmiProvider = new WagmiProvider(this.wagmiConfig);
      }
    }
  }

  render() {
    if (!this.address) {
      return html`<div>Invalid address</div>`;
    }

    const blockExplorerBaseUrl = this.wagmiConfig
      ? (getAccount(this.wagmiConfig).chain?.blockExplorers?.default.url ??
        null)
      : null;

    return html`
      <div @click=${this.onClick} class=${this.clickable ? "clickable" : ""}>
        <ens-avatar
          .address=${this.address}
          .avatarUri=${this.ensAvatar}
        ></ens-avatar>

        <address-details
          .address=${this.address}
          .ensName=${this.ensName}
          .addressStyle=${this.addressStyle}
          .blockExplorerBaseUrl=${blockExplorerBaseUrl}
        ></address-details>
      </div>
    `;
  }

  private async updateEnsData() {
    if (!this.wagmiConfig || !this.wagmiProvider || !this.address) {
      return;
    }

    this.ensName = undefined;
    this.ensAvatar = undefined;

    const ensName = await this.wagmiProvider.getEnsName(this.address);

    if (!ensName) {
      this.ensName = null;
      return;
    }
    this.ensName = ensName;

    const ensAvatar = await this.wagmiProvider.getEnsAvatar(this.ensName);

    if (!ensAvatar) {
      this.ensAvatar = null;
      return;
    }
    this.ensAvatar = ensAvatar;
  }

  private onClick() {
    if (!this.clickable) return;

    const clickEvent = new CustomEvent("address-click", {
      detail: {
        address: this.address,
        ensName: this.ensName,
        ensAvatar: this.ensAvatar,
      },
    });

    this.dispatchEvent(clickEvent);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "address-display": AddressDisplayComponent;
  }
}
