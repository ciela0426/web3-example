import { useWeb3React } from '@web3-react/core';

import { connectors } from "../connector/Connectors";

const useWeb3 = () => {
  const { active, account, library, connector, activate, deactivate } = useWeb3React();

  const connect = async (type) => {
    try {
      if (type === 'metamask') {
        await changeToBinanceChain();
        await activate(connectors.injected);
      } else {
        await activate(connectors.walletconnect);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const disconnect = async () => {
    try {
      await deactivate();
    } catch (error) {
      console.error(error);
    }
  };

  return { connect, disconnect, account, active, library, connector };
};

async function changeToBinanceChain() {
  const binanceChainId = '0x' + Number(56).toString(16);

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: binanceChainId }],
    });
  } catch (e) {
    if (e.code === 4902) {
      console.log('request add chain');
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainName: 'Binance',
            chainId: binanceChainId,
            nativeCurrency: {
              name: 'BNB',
              decimals: 18,
              symbol: 'BNB',
            },
            rpcUrls: ['https://bsc-dataseed.binance.org/'],
          },
        ],
      });
    }
  }
}

export { useWeb3 };
