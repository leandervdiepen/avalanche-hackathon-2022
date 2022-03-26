// import { Web3ReactProvider } from "@web3-react/core";
// import ConnectWallet from "../../components/ConnectWallet";
// import { Web3Provider } from "@ethersproject/providers";
import CoinbaseWalletCard from "../../components/connectors/CoinbaseWalletCard";
import MetamaskCard from "../../components/connectors/MetamaskCard";
import { useState } from "react";
import Provider from "../../components/Provider";

function connect() {
  return (
    <div>
      <Provider />
      <div className="container mx-auto flex flex-row grid grid-cols-2">
      <CoinbaseWalletCard />
      <MetamaskCard />
      </div>
    </div>
  );
}

export default connect;
