import "./staking.scss";

import { Callout } from "@vegaprotocol/ui-toolkit";
import { useWeb3React } from "@web3-react/core";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link, useRouteMatch } from "react-router-dom";

import { BulletHeader } from "../../components/bullet-header";
import { EtherscanLink } from "../../components/etherscan-link";
import { CopyToClipboardType } from "../../components/etherscan-link/etherscan-link";
import { Error, Tick } from "../../components/icons";
import {
  KeyValueTable,
  KeyValueTableRow,
} from "../../components/key-value-table";
import { Links } from "../../config";
import {
  AppStateActionType,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { BigNumber } from "../../lib/bignumber";
import { formatNumber } from "../../lib/format-number";
import { Staking as StakingQueryResult } from "./__generated__/Staking";
import { ConnectToVega } from "./connect-to-vega";
import { NodeList } from "./node-list";

export const Staking = ({ data }: { data?: StakingQueryResult }) => {
  const { t } = useTranslation();

  const currentEpoch = React.useMemo(() => {
    return data?.epoch.id!;
  }, [data?.epoch.id]);

  const stakeThisEpoch = React.useMemo(() => {
    const delegations = data?.party?.delegations || [];
    const amountsThisEpoch = delegations
      .filter((d) => d.epoch === Number(currentEpoch))
      .map((d) => new BigNumber(d.amountFormatted));
    return BigNumber.sum.apply(null, [new BigNumber(0), ...amountsThisEpoch]);
  }, [data?.party?.delegations, currentEpoch]);

  return (
    <>
      <section>
        <p>{t("stakingDescription1")}</p>
        <p>{t("stakingDescription2")}</p>
        <p>{t("stakingDescription3")}</p>
        <p>{t("stakingDescription4")}</p>
        <a href={Links.STAKING_GUIDE} target="_blank" rel="noreferrer">
          {t("readMoreStaking")}
        </a>
      </section>
      <div className="staking__table">
        <KeyValueTable>
          <KeyValueTableRow>
            <th>{t("stakedNextEpoch")}</th>
            <td>{t("vegaAmount", { amount: stakeThisEpoch.toString() })}</td>
          </KeyValueTableRow>
          <KeyValueTableRow>
            <th>{t("stakingReward")}</th>
            <td>--</td>
          </KeyValueTableRow>
          <KeyValueTableRow>
            <th>{t("prevEpoch")}</th>
            <td>--</td>
          </KeyValueTableRow>
        </KeyValueTable>
      </div>
      <StakingStepSelectNode data={data} />

      <section>
        <BulletHeader tag="h2" style={{ marginTop: 0 }}>
          {t("stakingStep1")}
        </BulletHeader>
        <StakingStepConnectWallets />
      </section>
      <section>
        <BulletHeader tag="h2">{t("stakingStep2")}</BulletHeader>
        <StakingStepAssociate
          associated={
            new BigNumber(
              data?.party?.stake.currentStakeAvailableFormatted || "0"
            )
          }
        />
      </section>
      <section>
        <BulletHeader tag="h2">{t("stakingStep3")}</BulletHeader>
        <StakingStepSelectNode data={data} />
      </section>
    </>
  );
};

export const StakingStepConnectWallets = () => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const {
    appState: { currVegaKey },
    appDispatch,
  } = useAppState();

  if (currVegaKey && account) {
    return (
      <Callout intent="success" icon={<Tick />} title={"Connected"}>
        <p>
          {t("Connected Ethereum address")}&nbsp;
          <EtherscanLink
            address={account}
            text={account}
            copyToClipboard={CopyToClipboardType.LINK}
          />
        </p>
        <p>{t("stakingVegaWalletConnected", { key: currVegaKey.pub })}</p>
      </Callout>
    );
  }

  return (
    <>
      <p>
        <Trans
          i18nKey="stakingStep1Text"
          components={{
            vegaWalletLink: (
              // eslint-disable-next-line jsx-a11y/anchor-has-content
              <a href={Links.WALLET_GUIDE} target="_blank" rel="noreferrer" />
            ),
          }}
        />
      </p>
      {account ? (
        <Callout
          icon={<Tick />}
          intent="success"
          title={`Ethereum wallet connected: ${account}`}
        />
      ) : (
        <p>
          <button
            onClick={() =>
              appDispatch({
                type: AppStateActionType.SET_ETH_WALLET_OVERLAY,
                isOpen: true,
              })
            }
            className="fill"
            type="button"
          >
            {t("connectEthWallet")}
          </button>
        </p>
      )}
      {currVegaKey ? (
        <Callout
          icon={<Tick />}
          intent="success"
          title={`Vega wallet connected: ${currVegaKey.pubShort}`}
        />
      ) : (
        <ConnectToVega />
      )}
    </>
  );
};

export const StakingStepAssociate = ({
  associated,
}: {
  associated: BigNumber;
}) => {
  const match = useRouteMatch();
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const {
    appState: { currVegaKey },
  } = useAppState();

  if (!account) {
    return (
      <Callout
        intent="error"
        icon={<Error />}
        title={t("stakingAssociateConnectEth")}
      />
    );
  } else if (!currVegaKey) {
    return (
      <Callout
        intent="error"
        icon={<Error />}
        title={t("stakingAssociateConnectVega")}
      />
    );
  }
  if (associated.isGreaterThan(0)) {
    return (
      <Callout
        intent="success"
        icon={<Tick />}
        title={t("stakingHasAssociated", { tokens: formatNumber(associated) })}
      >
        <p>
          <Link to="/staking/associate">
            <button className="fill">{t("stakingAssociateMoreButton")}</button>
          </Link>
        </p>
        <Link to="/staking/disassociate">
          <button className="fill">{t("stakingDisassociateButton")}</button>
        </Link>
      </Callout>
    );
  }

  return (
    <>
      <p>{t("stakingStep2Text")}</p>
      <Link to={`${match.path}/associate`}>
        <button type="button" className="fill">
          {t("associateButton")}
        </button>
      </Link>
    </>
  );
};

export const StakingStepSelectNode = ({
  data,
}: {
  data?: StakingQueryResult;
}) => {
  return <NodeList epoch={data?.epoch} party={data?.party} />;
};
