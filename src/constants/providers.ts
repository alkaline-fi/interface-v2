import { deepCopy } from '@ethersproject/properties';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { isPlain } from '@reduxjs/toolkit';

import { AVERAGE_L1_BLOCK_TIME, CHAIN_IDS_TO_NAMES } from './index';
import { ChainId } from '@uniswap/sdk';

export const rpcMap = {
  [ChainId.MAINNET]: 'https://eth.llamarpc.com',
  [ChainId.MATIC]: 'https://polygon-rpc.com/',
  [ChainId.MUMBAI]: 'https://rpc-mumbai.maticvigil.com/',
  [ChainId.DOGECHAIN]: 'https://rpc-sg.dogechain.dog/',
  [ChainId.DOGETESTNET]: 'https://rpc-testnet.dogechain.dog',
  [ChainId.ZKTESTNET]: 'https://rpc.public.zkevm-test.net',
  [ChainId.ZK_EVM]: 'https://zkevm-rpc.com',
  [ChainId.ZKSYNCALPHA]: 'https://testnet.era.zksync.dev',
  [ChainId.ZKSYNCERA]: 'https://mainnet.era.zksync.io',
  [ChainId.LINEAMAIN]: 'https://geth.mvm.dev',
  [ChainId.LINEATEST]: 'https://rpc.goerli.linea.build/',
};

class AppJsonRpcProvider extends StaticJsonRpcProvider {
  private _blockCache = new Map<string, Promise<any>>();
  get blockCache() {
    if (!this._blockCache.size) {
      this.once('block', () => this._blockCache.clear());
    }
    return this._blockCache;
  }

  constructor(chainId: ChainId) {
    super(rpcMap[chainId], {
      chainId,
      name: CHAIN_IDS_TO_NAMES[chainId],
    });

    this.pollingInterval = AVERAGE_L1_BLOCK_TIME;
  }

  send(method: string, params: Array<any>): Promise<any> {
    // Only cache eth_call's.
    if (method !== 'eth_call') return super.send(method, params);

    // Only cache if params are serializable.
    if (!isPlain(params)) return super.send(method, params);

    const key = `call:${JSON.stringify(params)}`;
    const cached = this.blockCache.get(key);
    if (cached) {
      this.emit('debug', {
        action: 'request',
        request: deepCopy({ method, params, id: 'cache' }),
        provider: this,
      });
      return cached;
    }

    const result = super.send(method, params);
    this.blockCache.set(key, result);
    return result;
  }
}

/**
 * These are the only JsonRpcProviders used directly by the interface.
 */
export const RPC_PROVIDERS: {
  [key in ChainId]: StaticJsonRpcProvider;
} = {
  [ChainId.MAINNET]: new AppJsonRpcProvider(ChainId.MAINNET),
  [ChainId.MATIC]: new AppJsonRpcProvider(ChainId.MATIC),
  [ChainId.MUMBAI]: new AppJsonRpcProvider(ChainId.MUMBAI),
  [ChainId.DOGECHAIN]: new AppJsonRpcProvider(ChainId.DOGECHAIN),
  [ChainId.DOGETESTNET]: new AppJsonRpcProvider(ChainId.DOGETESTNET),
  [ChainId.ZK_EVM]: new AppJsonRpcProvider(ChainId.ZK_EVM),
  [ChainId.ZKTESTNET]: new AppJsonRpcProvider(ChainId.ZKTESTNET),
  [ChainId.ZKSYNCALPHA]: new AppJsonRpcProvider(ChainId.ZKSYNCALPHA),
  [ChainId.ZKSYNCERA]: new AppJsonRpcProvider(ChainId.ZKSYNCERA),
  [ChainId.LINEAMAIN]: new AppJsonRpcProvider(ChainId.LINEAMAIN),
  [ChainId.LINEATEST]: new AppJsonRpcProvider(ChainId.LINEATEST),
};
