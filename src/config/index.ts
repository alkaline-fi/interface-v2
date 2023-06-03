import mainnet from './mainnet.json';
import polygon from './polygon.json';
import dogechain from './dogechain.json';
import zktestnet from './zktestnet.json';
import zkmainnet from './zkmainnet.json';
import zksyncalpha from './zksyncalpha.json';
import zksyncera from './zksyncera.json';
import lineatestnet from './lineatestnet.json';
import { ChainId } from '@uniswap/sdk';
const configs: any = {
  [ChainId.MAINNET]: mainnet,
  [ChainId.MATIC]: polygon,
  [ChainId.DOGECHAIN]: dogechain,
  [ChainId.ZKTESTNET]: zktestnet,
  [ChainId.ZK_EVM]: zkmainnet,
  [ChainId.ZKSYNCALPHA]: zksyncalpha,
  [ChainId.ZKSYNCERA]: zksyncera,
  [ChainId.LINEATEST]: lineatestnet,
};

export const getConfig = (network: ChainId | undefined) => {
  if (network === undefined) {
    return configs[ChainId.MATIC];
  }
  const config = configs[network];
  return config;
};
