import { Config, getEnsAvatar, getEnsName } from "@wagmi/core";

export interface IWagmiProvider {
  getEnsName: (address: string) => Promise<string | null>;
  getEnsAvatar: (name: string) => Promise<string | null>;

  updateConfig: (config: Config) => void;
}

export class WagmiProvider implements IWagmiProvider {
  constructor(private config: Config) {}

  async getEnsName(address: string): Promise<string | null> {
    return await getEnsName(this.config, { address });
  }

  async getEnsAvatar(name: string): Promise<string | null> {
    return await getEnsAvatar(this.config, { name });
  }

  updateConfig(config: Config) {
    this.config = config;
  }
}
