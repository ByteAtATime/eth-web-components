import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../index.ts";
import { AddressDisplayComponent } from "~/address-display/address-display.component.ts";
import { createConfig, http } from "@wagmi/core";
import { mainnet } from "@wagmi/core/chains";
import { IWagmiProvider } from "~~/wagmi-provider.ts";

const mockWagmiProvider = {
  getEnsName: vi.fn(async (address) => {
    if (address === "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045") {
      return "vitalik.eth";
    }

    if (address === "0x34aA3F359A9D614239015126635CE7732c18fDF3") {
      return "austingriffith.eth";
    }

    return null;
  }),
  getEnsAvatar: vi.fn(async (name) => {
    if (name === "vitalik.eth") {
      return "https://vitalik.eth/avatar";
    }

    if (name === "austingriffith.eth") {
      return "https://austingriffith.eth/avatar";
    }

    return null;
  }),
  updateConfig: vi.fn(),
} satisfies IWagmiProvider;

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
    el.wagmiProvider = mockWagmiProvider;
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
      .toBe("https://vitalik.eth/avatar");

    expect(mockWagmiProvider.getEnsName).toHaveBeenCalledWith(MOCK_ADDRESS);
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

    await Promise.all([
      expect.poll(() => getEnsName()).toBe("vitalik.eth"),
      expect.poll(() => getEnsAvatar()).toContain("https://"),
    ]);
    expect(mockWagmiProvider.getEnsName).toHaveBeenCalledWith(MOCK_ADDRESS);
    expect(mockWagmiProvider.getEnsAvatar).toHaveBeenCalledWith("vitalik.eth");

    const prevEnsAvatar = getEnsAvatar();

    el.address = "0x34aA3F359A9D614239015126635CE7732c18fDF3";

    await Promise.all([
      expect.poll(() => getEnsName()).toBe("austingriffith.eth"),
      expect.poll(() => getEnsAvatar()).toContain("https://"),
    ]);
    expect(mockWagmiProvider.getEnsName).toHaveBeenCalledWith(
      "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    );
    expect(mockWagmiProvider.getEnsAvatar).toHaveBeenCalledWith(
      "austingriffith.eth",
    );

    expect(prevEnsAvatar).not.toBe(getEnsAvatar());
  });

  it("should update the ensName and ensAvatar when the wagmiConfig changes", async () => {
    el.address = "0x34aA3F359A9D614239015126635CE7732c18fDF3";

    const getDetailsTitle = () =>
      el
        .shadowRoot!.querySelector("address-details")
        ?.shadowRoot?.querySelector("p")
        ?.textContent?.trim();

    const getEnsAvatar = () =>
      el
        .shadowRoot!.querySelector("ens-avatar")
        ?.shadowRoot?.querySelector("img")?.src;

    await Promise.all([
      expect.poll(() => getDetailsTitle()).toBe("0x34aA...fDF3"),
      expect.poll(() => getEnsAvatar()).toContain("data:image/svg+xml;base64,"),
    ]);
    expect(mockWagmiProvider.getEnsName).toBeCalledTimes(0);
    expect(mockWagmiProvider.getEnsAvatar).toBeCalledTimes(0);

    const prevEnsAvatar = getEnsAvatar();

    el.wagmiConfig = wagmiConfig;

    await Promise.all([
      expect.poll(() => getDetailsTitle()).toBe("austingriffith.eth"),
      expect.poll(() => getEnsAvatar()).toContain("https://"),
    ]);
    expect(mockWagmiProvider.getEnsName).toHaveBeenCalledWith(
      "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    );
    expect(mockWagmiProvider.getEnsAvatar).toHaveBeenCalledWith(
      "austingriffith.eth",
    );

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
    mockWagmiProvider.updateConfig.mockClear();
    mockWagmiProvider.getEnsName.mockClear();
    mockWagmiProvider.getEnsAvatar.mockClear();
  });
});
