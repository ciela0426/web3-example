import { useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { isMobile } from 'react-device-detect';


import { connectors } from "./connector/connectors";
import { truncateAddress } from "./assets/utils/utils";

import './assets/css/reset.css';
import './assets/css/main.css';

const NO_ETHEREUM_OBJECT = /No Ethereum provider was found on window.ethereum/;

export const isNoEthereumObject = (err) => {
  return NO_ETHEREUM_OBJECT.test(err);
};

// Wallet 선택을 위한 Modal Component
const ModalWallet = ({modalOpen, setModalOpen}) => {

  const { active, activate, deactivate } = useWeb3React();

  // metamask 연결
  const handleConnect = () => {
    if (active) {
      deactivate();
      return;
    }
    activate(connectors.injected, (error) => {
      if (isNoEthereumObject(error))
        window.open("https://metamask.io/download.html");
    });
    setModalOpen(false);
  };

  // walletconnect 연결
  const handleConnectWallet = () => {
    activate(connectors.walletconnect);
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
          className={isMobile ? 'wallet_connect mobile' : 'wallet_connect'}
          onClick={handleConnectWallet}
        >
          wallet connect
        </div>
        {isMobile 
          ? null
          : <div
              className='metamask'
              onClick={handleConnect}
            >
              metamask
            </div>
        }
      </div>
    </div>
  );
}

const App = () => {

  const { chainId, account, deactivate, active } = useWeb3React();

  const [modalOpen, setModalOpen] = useState(false);

  const disconnect = () => {
    deactivate();
  };

  return (
    <div id="component">
      <p className="account">{`Account: ${account ? account : "No Account"}`}</p>
      <p className="account">{`Account for short: ${truncateAddress(account)}`}</p>
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
