import { useEffect, useState } from "react";

import { useWeb3React } from "@web3-react/core";

import { connectors } from "./connector/connectors";
import { truncateAddress } from "./assets/utils/utils";

import './assets/css/reset.css';
import './assets/css/main.css';

const NO_ETHEREUM_OBJECT = /No Ethereum provider was found on window.ethereum/;

export const isNoEthereumObject = (err) => {
  return NO_ETHEREUM_OBJECT.test(err);
};

const ModalWallet = ({modalOpen, setModalOpen}) => {

  const { active, activate, deactivate } = useWeb3React();

  const setProvider = (type) => {
    window.localStorage.setItem("provider", type);
  };

  const handleConnect = () => {
    if (active) {
      deactivate();
      return;
    }
    activate(connectors.injected, (error) => {
      if (isNoEthereumObject(error))
        window.open("https://metamask.io/download.html");
    });
    setProvider("walletConnect");
    setModalOpen(false);
  };

  const handleConnectWallet = () => {
    activate(connectors.walletConnect);
    setProvider("walletConnect");
    setModalOpen(false);
  };

  return(
    <div className="dim">
      <div className="wallet_popup">
        <div
          className="modal_close_button"
          onClick={() => {
            setModalOpen(!modalOpen);
          }}
        ></div>
        <div
          className='wallet_connect'
          onClick={handleConnectWallet}
        >
          wallet connect
        </div>
        <div
          className='metamask'
          onClick={handleConnect}
        >
          metamask
        </div>
      </div>
    </div>
  );
}

const App = () => {

  const { chainId, account, activate, deactivate, active } = useWeb3React();

  const [modalOpen, setModalOpen] = useState(false);

  const refreshState = () => {
    window.localStorage.setItem("provider", undefined);
  };

  const disconnect = () => {
    refreshState();
    deactivate();
  };

  useEffect(() => {
    // const provider = window.localStorage.getItem("provider");
    // if (provider) activate(connectors[provider]);
  }, []);

  return (
    <div id="component">
      <p className="account">{`Account: ${truncateAddress(account)}`}</p>
      <p className="network">{`Network ID: ${chainId ? chainId : "No Network"}`}</p>
        {active ? (
          <div
            className="connect_wallet_button"
            onClick={disconnect}
          >
            disconnect
          </div>
        ) : (
          <div
            className="connect_wallet_button"
            onClick={() => {
              setModalOpen(!modalOpen);
            }}
          >
            Connect Wallet
          </div>
        )}
        {modalOpen && <ModalWallet modalOpen={modalOpen} setModalOpen={setModalOpen} />}
    </div>
  );
}

export default App;
