import { useTransaction } from "../../hooks/use-transaction";
import { useVegaClaim } from "../../hooks/use-vega-claim";
import { IClaimTokenParams } from "../../lib/vega-web3/vega-web3-types";

export const useClaim = (claimData: IClaimTokenParams, address: string) => {
  const claimArgs = {
    ...claimData,
    ...claimData.signature,
    ...claimData.claim,
    country: claimData.country!,
    account: address,
  };
  const claim = useVegaClaim();
  return useTransaction(
    () => claim.claim(claimArgs),
    () => claim.checkClaim(claimArgs)
  );
};
