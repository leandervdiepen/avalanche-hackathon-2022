import { useWeb3React } from "@web3-react/core";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useEffect } from "react";

const CoinbaseWallet = new WalletLinkConnector({
  url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
  appName: "Web3-react Demo",
  supportedChainIds: [1, 3, 4, 5, 42],
});

const WalletConnect = new WalletConnectConnector({
  rpcUrl: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
});

const Injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
});

function ConnectWallet({ walletConnected, setWalletConnected }) {
  const { activate, deactivate } = useWeb3React();
  const { active, chainId, account } = useWeb3React();
  console.log(active, chainId, account);
  // useEffect(() => {
  //   if (active) {
  //     setWalletConnected(true);
  //   }
  // }, [active]);
  return (
    <div>
      {!walletConnected && (
        <div className="connectWallet container flex flex-col grid grid-cols-3 justify-center items-center align-center">
          <button
            className="col-span-1 mx-auto my-8"
            onClick={() => {
              activate(CoinbaseWallet);
              setWalletConnected(true);
            }}
          >
            Coinbase Wallet
          </button>
          <button
            className="col-span-1 mx-auto my-8"
            onClick={() => {
              activate(WalletConnect);
              setWalletConnected(true);
            }}
          >
            Wallet Connect
          </button>
          <button
            className="col-span-1 mx-auto my-8"
            onClick={() => {
              activate(Injected);
              setWalletConnected(true);
            }}
          >
            Metamask
          </button>
        </div>
      )}
      {walletConnected && (
        <div className="connectWallet container flex">
          <button
            className="col-span-1 mx-auto my-8"
            onClick={() => {
              deactivate();
              setWalletConnected(false);
            }}
          >
            Disconnect
          </button>
        </div>
      )}
      <div className="container connection flex flex-col mx-auto justify-center align-center">
        <div className="flex flex-row">
          {`Connection Status: `}
          {active === true ? <p>Connected</p> : <p>Not Connected</p>}
        </div>
        <div className="flex flex-row">
          {`Account: `} {account !== undefined ? <p>{account}</p> : <p>-</p>}
        </div>
        <div className="flex flex-row">
          {`Network ID: `} {chainId !== undefined ? <p>{chainId}</p> : <p>-</p>}
        </div>
      </div>
    </div>
  );
}

export default ConnectWallet;
