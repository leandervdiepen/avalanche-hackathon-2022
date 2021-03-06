import { useEffect } from "react";
import { useRouter } from "next/router";
import { coinbaseWallet, hooks } from "../../connectors/coinbase";
import { Accounts } from "../Accounts";
import { Card } from "../Card";
import { Chain } from "../Chain";
import { ConnectWithSelect } from "../ConnectWith";
import { Status } from "../Status";
import { useMoralis } from "react-moralis";
import ethers from "ethers"

const {
  useChainId,
  useAccounts,
  useError,
  useIsActivating,
  useIsActive,
  useProvider,
  useENSNames,
} = hooks;

export default function CoinbaseWalletCard() {
  const chainId = useChainId();
  const accounts = useAccounts();
  const error = useError();
  const isActivating = useIsActivating();

  const isActive = useIsActive();

  const provider = useProvider();
  const ENSNames = useENSNames(provider);

  const router = useRouter();

  // attempt to connect eagerly on mount
  useEffect(() => {
    void coinbaseWallet.connectEagerly();
  }, []);

  // redirect to user profile if connected
  useEffect(() => {
    if (isActive) {
      router.push("/swapandtransfer");
    }
  });

  return (
    <Card>
      <div>
        <b>Coinbase Wallet</b>
        <Status isActivating={isActivating} error={error} isActive={isActive} />
        <div style={{ marginBottom: "1rem" }} />
        <Chain chainId={chainId} />
        <Accounts accounts={accounts} provider={provider} ENSNames={ENSNames} />
      </div>
      <div style={{ marginBottom: "1rem" }} />
      <ConnectWithSelect
        connector={coinbaseWallet}
        chainId={chainId}
        isActivating={isActivating}
        error={error}
        isActive={isActive}
      />
    </Card>
  );
}
