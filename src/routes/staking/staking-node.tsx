import "./staking-node.scss";
import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { ValidatorTable } from "./validator-table";
import { VegaKeyExtended } from "../../contexts/app-state/app-state-context";
import { EpochCountdown } from "../../components/epoch-countdown";
import { YourStake } from "./your-stake";
import { StakingForm } from "./staking-form";
import { StakingWalletsContainer } from "./staking-wallets-container";
import { BigNumber } from "../../lib/bignumber";
import { Staking as StakingQueryResult } from "./__generated__/Staking";
import { StakingNodesContainer } from "./staking-nodes-container";
import { Colors } from "../../config";
import { ConnectToVega } from "./connect-to-vega";

export const StakingNodeContainer = () => {
  return (
    <StakingWalletsContainer>
      {({ currVegaKey }) =>
        currVegaKey ? (
          <StakingNodesContainer>
            {({ data }) => <StakingNode vegaKey={currVegaKey} data={data} />}
          </StakingNodesContainer>
        ) : (
          <ConnectToVega />
        )
      }
    </StakingWalletsContainer>
  );
};

interface StakingNodeProps {
  vegaKey: VegaKeyExtended;
  data?: StakingQueryResult;
}

export const StakingNode = ({ vegaKey, data }: StakingNodeProps) => {
  const { node } = useParams<{ node: string }>();
  const { t } = useTranslation();

  const currentDelegationAmount = React.useMemo(() => {
    if (!data?.party?.delegations) return new BigNumber(0);
    const amounts = data.party.delegations
      .filter(({ epoch }) => epoch.toString() === data.epoch.id)
      .map((d) => new BigNumber(d.amountFormatted));
    return BigNumber.sum.apply(null, [new BigNumber(0), ...amounts]);
  }, [data]);
  const unstaked = React.useMemo(() => {
    return new BigNumber(data?.party?.stake.currentStakeAvailable || 0).minus(
      currentDelegationAmount
    );
  }, [currentDelegationAmount, data?.party?.stake.currentStakeAvailable]);

  const nodeInfo = React.useMemo(() => {
    return data?.nodes?.find(({ id }) => id === node);
  }, [node, data]);

  const currentEpoch = React.useMemo(() => {
    return data?.epoch.id!;
  }, [data?.epoch.id]);

  const stakeThisEpoch = React.useMemo(() => {
    const delegations = data?.party?.delegations || [];
    const amountsThisEpoch = delegations
      .filter((d) => d.node.id === node)
      .filter((d) => d.epoch === Number(currentEpoch))
      .map((d) => new BigNumber(d.amountFormatted));
    return BigNumber.sum.apply(null, [new BigNumber(0), ...amountsThisEpoch]);
  }, [data?.party?.delegations, node, currentEpoch]);

  const stakeNextEpoch = React.useMemo(() => {
    const delegations = data?.party?.delegations || [];
    const amountsNextEpoch = delegations
      .filter((d) => d.node.id === node)
      .filter((d) => d.epoch === Number(currentEpoch) + 1)
      .map((d) => new BigNumber(d.amountFormatted));

    if (!amountsNextEpoch.length) {
      return stakeThisEpoch;
    }
    return BigNumber.sum.apply(null, [new BigNumber(0), ...amountsNextEpoch]);
  }, [currentEpoch, data?.party?.delegations, node, stakeThisEpoch]);

  if (!nodeInfo) {
    return (
      <span style={{ color: Colors.RED }}>
        {t("stakingNodeNotFound", { node })}
      </span>
    );
  }

  return (
    <>
      <h2 style={{ wordBreak: "break-word", marginTop: 0 }}>
        {t("VALIDATOR {{node}}", { node })}
      </h2>
      <p>Vega key: {vegaKey.pubShort}</p>
      <ValidatorTable
        node={nodeInfo}
        stakedTotal={data?.nodeData?.stakedTotalFormatted || "0"}
        stakeThisEpoch={stakeThisEpoch}
      />
      {data?.epoch.timestamps.start && data?.epoch.timestamps.expiry && (
        <EpochCountdown
          containerClass="staking-node__epoch"
          id={data.epoch.id}
          startDate={new Date(data?.epoch.timestamps.start)}
          endDate={new Date(data?.epoch.timestamps.expiry)}
        />
      )}
      <YourStake
        stakeNextEpoch={stakeNextEpoch}
        stakeThisEpoch={stakeThisEpoch}
      />
      <StakingForm
        pubkey={vegaKey.pub}
        nodeId={node}
        availableStakeToAdd={unstaked}
        availableStakeToRemove={currentDelegationAmount}
      />
    </>
  );
};
