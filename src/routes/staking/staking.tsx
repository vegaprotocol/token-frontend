import { useAppState } from "../../contexts/app-state/app-state-context";
import { Error, Tick } from "../../components/icons";
import { Link, useRouteMatch } from "react-router-dom";
import { NodeList, NodeListItemProps } from "./node-list";
import { Trans, useTranslation } from "react-i18next";

import { BigNumber } from "../../lib/bignumber";
import { BulletHeader } from "../../components/bullet-header";
import { Callout } from "../../components/callout";
import { ConnectToVega } from "./connect-to-vega";
import { Links } from "../../config";
import React from "react";
import { Staking as StakingQueryResult } from "./__generated__/Staking";
import { useVegaUser } from "../../hooks/use-vega-user";
import { useWeb3 } from "../../contexts/web3-context/web3-context";
import { formatNumber } from "../../lib/format-number";

export const Staking = ({ data }: { data?: StakingQueryResult }) => {
  const { t } = useTranslation();

  return (
    <>
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
  const { connect, ethAddress } = useWeb3();
  const {
    appState: { currVegaKey },
  } = useAppState();

  if (currVegaKey && ethAddress) {
    return (
      <Callout intent="success" icon={<Tick />} title={"Connected"}>
        <p>
          {t("Connected Ethereum address")} {ethAddress}
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
              <a
                href={Links.WALLET_RELEASES}
                target="_blank"
                rel="noreferrer"
              />
            ),
          }}
        />
      </p>
      {ethAddress ? (
        <Callout
          icon={<Tick />}
          intent="success"
          title={`Ethereum wallet connected: ${ethAddress}`}
        />
      ) : (
        <p>
          <button onClick={connect} className="fill" type="button">
            {t("Connect to an Ethereum wallet")}
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
  const { ethAddress } = useWeb3();
  const {
    appState: { currVegaKey },
  } = useAppState();

  if (!ethAddress) {
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
  const { t } = useTranslation();
  const { currVegaKey } = useVegaUser();

  const nodes = React.useMemo<NodeListItemProps[]>(() => {
    if (!data?.nodes) return [];

    const nodesWithPercentages = data.nodes.map((node) => {
      const stakedTotal = new BigNumber(
        data?.nodeData?.stakedTotalFormatted || 0
      );
      const stakedOnNode = new BigNumber(node.stakedTotalFormatted);
      const stakedTotalPercentage =
        stakedTotal.isEqualTo(0) || stakedOnNode.isEqualTo(0)
          ? "-"
          : stakedOnNode.dividedBy(stakedTotal).times(100).dp(2).toString() +
            "%";

      const userStake = data.party?.delegations?.length
        ? data.party?.delegations
            ?.filter((d) => d.node.id === node.id)
            ?.filter((d) => d.epoch === Number(data.epoch.id))
            .reduce((sum, d) => {
              const value = new BigNumber(d.amountFormatted);
              return sum.plus(value);
            }, new BigNumber(0))
        : new BigNumber(0);

      const userStakePercentage =
        userStake.isEqualTo(0) || stakedOnNode.isEqualTo(0)
          ? "-"
          : userStake.dividedBy(stakedOnNode).times(100).dp(2).toString() + "%";

      return {
        id: node.id,
        name: node.name,
        pubkey: node.pubkey,
        stakedTotal,
        stakedOnNode,
        stakedTotalPercentage,
        userStake,
        userStakePercentage,
        epoch: data.epoch,
      };
    });

    return nodesWithPercentages;
  }, [data]);

  if (!currVegaKey) {
    return <p className="text-muted">{t("connectVegaWallet")}</p>;
  }

  return <NodeList nodes={nodes} epoch={data?.epoch} />;
};
