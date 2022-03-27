import { coinbaseWallet, hooks } from "../../connectors/coinbase";
import { Network } from "@web3-react/network";
import { CHAINS, getAddChainParameters, URLS } from "../../chains";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
// import CoinbaseWalletCard from "../../components/connectors/CoinbaseWalletCard";
import Web3 from "web3";
import ethers from "ethers";

// contract abis
import NFTContract from "../../abis/NFT.json";

const Config = {
  localhost: {
    url: "http://localhost:8545/",
    dataAddress: "0x2033a842a200c8Ff3bae5B22585aAe7E1abAFCc0",
    // appAddress: "0x9F544a3Fc3D1045e6ec49D4ecEF6dCD700457165",
  },
};

// class Contract {
//   web3;
//   nftContract;

//   constructor(network, callback) {

//   }
// }

export default function SwapAndTransfer() {
  const {
    useChainId,
    useAccounts,
    useError,
    useIsActivating,
    useIsActive,
    useProvider,
    useENSNames,
  } = hooks;
  const chainId = useChainId();
  const accounts = useAccounts();
  const error = useError();
  const isActivating = useIsActivating();
  const router = useRouter();
  const isActive = useIsActive();

  const provider = useProvider();
  const ENSNames = useENSNames(provider);
  const connector = coinbaseWallet;
  const isNetwork = connector instanceof Network;
  const chainIds = (isNetwork ? Object.keys(URLS) : Object.keys(CHAINS)).map(
    (chainId) => Number(chainId)
  );

  const [loggedIn, setLoggedIn] = useState(false);
  const [contract, setContract] = useState(null);

  const [desiredChainId, setDesiredChainId] = useState<number>(
    isNetwork ? 1 : -1
  );

  const displayDefault = !isNetwork;

  const ethEnabled = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      window.web3 = new Web3(window.ethereum);
      let contract = new window.web3.eth.Contract(
        NFTContract.abi,
        Config.localhost.dataAddress
      );
      setContract(contract);
      return true;
    } else {
      console.log("No web3? You should consider trying MetaMask!");
      return false;
    }
  };

  const switchChain = useCallback(
    async (desiredChainId: number) => {
      setDesiredChainId(desiredChainId);
      // if we're already connected to the desired chain, return
      if (desiredChainId === chainId) return;
      // if they want to connect to the default chain and we're already connected, return
      if (desiredChainId === -1 && chainId !== undefined) return;

      // if (connector instanceof WalletConnect || connector instanceof Network) {
      //   await connector.activate(
      //     desiredChainId === -1 ? undefined : desiredChainId
      //   );
      // } else {
      await connector.activate(
        desiredChainId === -1
          ? undefined
          : getAddChainParameters(desiredChainId)
      );
      // }
    },
    [connector, chainId]
  );
  const login = async () => {
    let loggedIn = await ethEnabled();
    console.log("logged in", loggedIn, web3.eth);
    if (loggedIn) {
      setLoggedIn(true);
    }
    // console.log("contract", contractObj);
  };

  const mint = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = accounts[0];
    contract.methods
      .createToken(
        "https://gateway.pinata.cloud/ipfs/QmZXsHdE13ruPqz3myrrSdnUZuMYtWmWr4DmRkuCT9jLAQ/"
      )
      .send(
        {
          from: accounts[0],
          gas: "1000000",
        },
        (err, res) => {
          console.log("Error", err);
          console.log("Result", res);
        }
      );
  };

  const transfer = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = accounts[0];
    console.log("account", account);
    contract.methods
      .sendTokens(10006, "0xcFa0EEF5CAf4d19198FDf8a5Cc85Ac2B1C21f30c", 5)
      .send(
        {
          from: account,
          gas: "10000000",
          value: web3.utils.toWei("0.07", "ether"),
        },
        (err, res) => {
          console.log("Error", err);
          console.log("Result", res);
        }
      );
    // approve
  };
  const approve = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = accounts[0];
    console.log("account", account);
    contract.methods
      .approve("0x2033a842a200c8ff3bae5b22585aae7e1abafcc0", 5)
      .send(
        {
          from: account,
          gas: "1000000",
        },
        (err, res) => {
          console.log("Error", err);
          console.log("Result", res);
        }
      );
  };

  return (
    <div className="container flex grid grid-cols-5">
      <h1 className="text-xl mx-auto my-8 col-span-5">
        Transfer your assets between different networks!
      </h1>
      <div className="flex items-center flex-col col-span-4">
        <div className="grid grid-cols-2">
          <label className="form-label inline-block mb-2">
            Select Origin Chain
          </label>
          <span className="col-span-2">
            <SelectOrigin
              chainId={desiredChainId}
              switchChain={switchChain}
              displayDefault={displayDefault}
              chainIds={chainIds}
            />
          </span>
          <label className="form-label inline-block mb-2 col-span-1">
            Select Destination Chain
          </label>
          <span>
            <SelectDestination chainIds={chainIds} />
          </span>
          <button
            onClick={async () => {
              await transfer();
            }}
          >
            Transfer Asset
          </button>
          <button onClick={approve}>Approve</button>
        </div>
        <button onClick={login}>Login</button>
        {loggedIn && <button onClick={mint}>Mint</button>}
      </div>
      {/* <div className="col-span-1">
        <CoinbaseWalletCard />
      </div> */}
    </div>
  );
}

function SelectOrigin({
  chainId,
  switchChain,
  displayDefault,
  chainIds,
}: {
  chainId: number;
  switchChain: (chainId: number) => void | undefined;
  displayDefault: boolean;
  chainIds: number[];
}) {
  return (
    <select
      value={chainId}
      onChange={(event) => {
        switchChain?.(Number(event.target.value));
      }}
      disabled={switchChain === undefined}
    >
      {displayDefault ? <option value={-1}>Default Chain</option> : null}
      {chainIds.map((chainId) => (
        <option key={chainId} value={chainId}>
          {CHAINS[chainId]?.name ?? chainId}
        </option>
      ))}
    </select>
  );
}

function SelectDestination({ chainIds }) {
  let selectedChain = -1;
  return (
    <select
      value={selectedChain}
      onChange={(event) => {
        selectedChain = Number(event.target.value);
      }}
    >
      {chainIds.map((chainId) => (
        <option key={chainId} value={chainId}>
          {CHAINS[chainId]?.name ?? chainId}
        </option>
      ))}
    </select>
  );
}
