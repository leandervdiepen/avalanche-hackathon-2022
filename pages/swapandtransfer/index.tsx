import { coinbaseWallet, hooks } from "../../connectors/coinbase";
import { Network } from "@web3-react/network";
import { CHAINS, getAddChainParameters, URLS } from "../../chains";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";

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

  const [desiredChainId, setDesiredChainId] = useState<number>(
    isNetwork ? 1 : -1
  );

  const displayDefault = !isNetwork;

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

  return (
    <div className="container flex flex-col">
      <h1 className="text-xl mx-auto my-8">
        Transfer your assets between different networks!
      </h1>
      <div className="flex flex-col items-center grid grid-cols-3">
        <label className="form-label inline-block mb-2 col-span-1">
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
      </div>
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
