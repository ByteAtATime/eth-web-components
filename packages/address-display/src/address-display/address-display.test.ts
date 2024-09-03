import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../index.ts";
import { AddressDisplayComponent } from "~/address-display/address-display.component.ts";
import { createConfig, http } from "@wagmi/core";
import { mainnet } from "@wagmi/core/chains";

const MOCK_ADDRESS = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"; // vitalik.eth
const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

describe("address-display", () => {
  let el: AddressDisplayComponent;

  beforeEach(() => {
    el = document.createElement("address-display");
    document.documentElement.appendChild(el);
    el.address = MOCK_ADDRESS;
  });

  it("should render the component", async () => {
    expect(el).toBeInTheDocument();
  });

  it("should render a blockie when not given a wagmiConfig", async () => {
    await expect
      .poll(
        () =>
          el
            .shadowRoot!.querySelector("ens-avatar")
            ?.shadowRoot?.querySelector("img")?.src,
      )
      .toContain("data:image/svg+xml;base64,");
  });

  it("should render an avatar when given a wagmiConfig", async () => {
    el.wagmiConfig = wagmiConfig;

    await expect
      .poll(
        () =>
          el
            .shadowRoot!.querySelector("ens-avatar")
            ?.shadowRoot?.querySelector("img")?.src,
      )
      .toContain("https://");
  });

  it("should render an address-details component", async () => {
    await expect
      .poll(() => el.shadowRoot!.querySelector("address-details"))
      .toBeInTheDocument();
  });

  it("should update the ensName and ensAvatar when the address changes", async () => {
    el.wagmiConfig = wagmiConfig;

    const getEnsName = () =>
      el
        .shadowRoot!.querySelector("address-details")
        ?.shadowRoot?.querySelector("p")
        ?.textContent?.trim();

    const getEnsAvatar = () =>
      el
        .shadowRoot!.querySelector("ens-avatar")
        ?.shadowRoot?.querySelector("img")?.src;

    await expect.poll(() => getEnsName()).toBe("vitalik.eth");
    await expect.poll(() => getEnsAvatar()).toContain("https://");
    const prevEnsAvatar = getEnsAvatar();

    el.address = "0x34aA3F359A9D614239015126635CE7732c18fDF3";

    await expect.poll(() => getEnsName()).toBe("austingriffith.eth");
    await expect.poll(() => getEnsAvatar()).toContain("https://");

    expect(prevEnsAvatar).not.toBe(getEnsAvatar());
  });

  it("should emit an event when clicked with clickable set to true", async () => {
    el.clickable = true;

    const onClick = vi.fn();
    el.addEventListener("address-click", onClick);

    el.shadowRoot!.querySelector("div")!.click();

    expect(onClick).toHaveBeenCalled();
  });

  it("should throw an error when the address is invalid", async () => {
    expect(() => {
      // @ts-expect-error -- this is a test
      el.address = "invalid address";
    }).toThrow();
  });

  it("should render an invalid address message when the address is not provided", async () => {
    el.address = null;
    await expect
      .poll(() => el.shadowRoot!.textContent)
      .toContain("Invalid address");
  });

  afterEach(() => {
    el.remove();
  });
});
