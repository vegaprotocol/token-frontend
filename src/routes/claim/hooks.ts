import { useContracts } from "../../contexts/contracts/contracts-context";
import { useTransaction } from "../../hooks/use-transaction";
import { IClaimTokenParams } from "../../lib/vega-web3/vega-web3-types";

export const useClaim = (claimData: IClaimTokenParams, address: string) => {
  const claimArgs = {
    ...claimData,
    ...claimData.signature,
    ...claimData.claim,
    country: claimData.country!,
    account: address,
  };
  const { claim } = useContracts();
  return useTransaction(
    () => claim.claim(claimArgs),
    () => claim.checkClaim(claimArgs)
  );
};
