import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../index.ts";
import { AddressDetailsComponent } from "~/address-details/address-details.component.ts";

const MOCK_ADDRESS = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"; // vitalik.eth

describe("address-details", () => {
  let el: AddressDetailsComponent;

  beforeEach(() => {
    el = document.createElement("address-details") as AddressDetailsComponent;
    document.documentElement.appendChild(el);
    el.address = MOCK_ADDRESS;
  });

  it("should render the component", async () => {
    expect(el).toBeInTheDocument();
  });

  it("should render an address with a short style", async () => {
    el.addressStyle = "short";

    await expect
      .poll(() => el.shadowRoot!.textContent)
      .toContain("0xd8dA...6045");
  });

  it("should render an address with a long style", async () => {
    el.addressStyle = "long";

    await expect.poll(() => el.shadowRoot!.textContent).toContain(MOCK_ADDRESS);
  });

  it("should render an ens name if provided", async () => {
    el.ensName = "vitalik.eth";
    el.blockExplorerBaseUrl = null;

    await expect
      .poll(() => el.shadowRoot!.textContent)
      .toContain("vitalik.eth");
  });

  it("should render a copy address button", async () => {
    const copyAddress = el.shadowRoot!.querySelector("copy-address");

    await expect.poll(() => copyAddress).toBeInTheDocument();
  });

  it("should render an open in explorer link with a base url", async () => {
    el.blockExplorerBaseUrl = "https://etherscan.io";
    const explorerLink = el.shadowRoot!.querySelector("a");

    await expect
      .poll(() => explorerLink?.getAttribute("href"))
      .toContain(`https://etherscan.io/address/${MOCK_ADDRESS}`);
  });

  afterEach(() => {
    el.remove();
  });
});
