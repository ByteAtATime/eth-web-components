import "@byteatatime/address-display";
import { createConfig, http } from "@wagmi/core";
import { mainnet } from "@wagmi/core/chains";

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
With config:
<address-display class="withConfig" address="0x34aA3F359A9D614239015126635CE7732c18fDF3"></address-display>

<hr />

Without config:
<address-display address="0x34aA3F359A9D614239015126635CE7732c18fDF3"></address-display>
`;

document.querySelectorAll("address-display.withConfig").forEach((display) => {
  display.wagmiConfig = config;
});
