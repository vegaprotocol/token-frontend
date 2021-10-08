import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Callout } from "../../components/callout";
import { EtherscanLink } from "../../components/etherscan-link";
import { Tick } from "../../components/icons";
import { useWeb3 } from "../../contexts/web3/web3-context";
import { BigNumber } from "../../lib/bignumber";
import { formatNumber } from "../../lib/format-number";
import { Routes } from "../router-config";

export const Complete = ({
  address,
  balanceFormatted,
  commitTxHash,
  claimTxHash,
}: {
  address: string;
  balanceFormatted: BigNumber;
  commitTxHash: string | null;
  claimTxHash: string | null;
}) => {
  const { t } = useTranslation();
  const { chainId } = useWeb3();

  return (
    <>
      <Callout intent="success" title="Claim complete" icon={<Tick />}>
        <p>
          <Trans
            i18nKey="claimCompleteMessage"
            values={{
              address,
              balance: formatNumber(balanceFormatted),
            }}
          />
        </p>
        {commitTxHash && (
          <p style={{ margin: 0 }}>
            {t("Link transaction")}:{" "}
            <EtherscanLink
              chainId={chainId!}
              tx={commitTxHash}
              text={commitTxHash}
            />
          </p>
        )}
        {claimTxHash && (
          <p>
            {t("Claim transaction")}:{" "}
            <EtherscanLink
              chainId={chainId!}
              tx={claimTxHash}
              text={claimTxHash}
            />
          </p>
        )}
        <Link to={Routes.VESTING}>
          <button className="fill">
            {t("Check your vesting VEGA tokens")}
          </button>
        </Link>
      </Callout>
    </>
  );
};
