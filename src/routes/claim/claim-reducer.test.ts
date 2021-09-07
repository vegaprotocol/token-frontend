import {ClaimAction, ClaimActionType, claimReducer, initialClaimState} from "./claim-reducer";

it('Handles large denomination numbers', () => {
  const state = initialClaimState
  const action: ClaimAction = {
    type: ClaimActionType.SET_DATA_FROM_URL,
    decimals: 18,
    data: {
      denomination: "200000000000000000000",
      target: undefined,
      trancheId: '11',
      expiry: '123',
      code: '123',
      nonce: 'test'
    }
  }

  const updatedState = claimReducer(state, action)

  expect(updatedState.denominationFormatted).toEqual("200")
})
