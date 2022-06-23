import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

const injected = new InjectedConnector({
  supportedChainIds: [
    1, // Mainet
    3, // Ropsten
    4, // Rinkeby
    5, // Goerli
    42, // Kovan
    56, // Binance
    97, // Binance test
    1337, // hashlike rpc
  ],
});

const walletconnect = new WalletConnectConnector({
  rpc: {
    56: 'https://bsc-dataseed.binance.org',
  },
  qrcode: true,
});

export const connectors = {
  injected: injected,
  walletconnect: walletconnect
};
