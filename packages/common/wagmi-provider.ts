// TODO: What is a good way to share this file between packages?
// TODO: Currently, I have installed the `@wagmi/core` and `viem` packages in root monorepo

import { Config, getEnsAvatar, getEnsName } from "@wagmi/core";
import { Address } from "viem";

export interface IWagmiProvider {
  getEnsName: (address: Address) => Promise<string | null>;
  getEnsAvatar: (name: string) => Promise<string | null>;

  updateConfig: (config: Config) => void;
}

export class WagmiProvider implements IWagmiProvider {
  constructor(private config: Config) {}

  async getEnsName(address: Address): Promise<string | null> {
    return await getEnsName(this.config, { address });
  }

  async getEnsAvatar(name: string): Promise<string | null> {
    return await getEnsAvatar(this.config, { name });
  }

  updateConfig(config: Config) {
    this.config = config;
  }
}
