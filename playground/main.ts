import { createConfig, http } from "@wagmi/core";
import { mainnet } from "@wagmi/core/chains";
import "~/index";
import type { AddressDisplay } from "~/index";

const display = document.querySelector("address-display");
const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});
display.wagmiConfig = config;

display.addEventListener("address-click", console.log);

setTimeout(() => {
  display.address = "0x34aA3F359A9D614239015126635CE7732c18fDF3";
}, 1000);
