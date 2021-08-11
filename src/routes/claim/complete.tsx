import BigNumber from "bignumber.js";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Callout } from "../../components/callout";
import { EtherscanLink } from "../../components/etherscan-link";
import { Tick } from "../../components/icons";
import { useAppState } from "../../contexts/app-state/app-state-context";

export const Complete = ({
  address,
  balance,
  trancheId,
  commitTxHash,
  claimTxHash,
}: {
  address: string;
  balance: BigNumber;
  trancheId: number;
  commitTxHash: string | null;
  claimTxHash: string | null;
}) => {
  const { t } = useTranslation();
  const {
    appState: { contractAddresses, chainId },
  } = useAppState();
  return (
    <>
      <Callout intent="success" title="Claim complete" icon={<Tick />}>
        <p>
          <Trans
            i18nKey="claimCompleteMessage"
            values={{
              address,
              balance: balance.toString(),
              trancheLinkText: `tranche ${trancheId}`,
            }}
            components={{
              trancheLink: <Link to={`/tranches/${trancheId}`} />,
            }}
          />
        </p>
        {commitTxHash && (
          <p style={{ margin: 0 }}>
            {t("Link transaction")}:{" "}
            <EtherscanLink
              chainId={chainId!}
              hash={commitTxHash}
              text={commitTxHash}
            />
          </p>
        )}
        {claimTxHash && (
          <p>
            {t("Claim transaction")}:{" "}
            <EtherscanLink
              chainId={chainId!}
              hash={claimTxHash}
              text={claimTxHash}
            />
          </p>
        )}
        <h4>
          {t(
            "Keep track of locked tokens in your wallet with the VEGA (VESTING) token."
          )}
        </h4>
        <p>
          {t(
            "The token address is {{address}}. Hit the add token button in your ERC20 wallet and enter this address.",
            {
              address: contractAddresses.lockedAddress,
            }
          )}
        </p>
      </Callout>
    </>
  );
};
