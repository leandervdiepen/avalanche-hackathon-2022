// import { Web3ReactProvider } from "@web3-react/core";
// import ConnectWallet from "../../components/ConnectWallet";
// import { Web3Provider } from "@ethersproject/providers";
import CoinbaseWalletCard from "../../components/connectors/CoinbaseWalletCard";
import MetamaskCard from "../../components/connectors/MetamaskCard";
import { useState } from "react";
import Provider from "../../components/Provider";

function connect() {
  const [walletConnected, setWalletConnected] = useState(false);
  return (
    <div>
      <Provider />
      {/* <ConnectWallet
        walletConnected={walletConnected}
        setWalletConnected={setWalletConnected}
      /> */}
      <div className="container mx-auto flex flex-row grid grid-cols-2">
      <CoinbaseWalletCard />
      <MetamaskCard />
      </div>
    </div>
  );
}

export default connect;
