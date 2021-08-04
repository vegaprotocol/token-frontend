const targetedClaimLink = `/claim/?r=0xf78012abf1178a407b9121c0a5632ca4bada6efc5bbc25d8e19d6411005540cd0e0b8c8fb8779a0154f39abcacc79d306e469af142d9858284c6414dca09331b1b&d=5&t=1&n=33469830324318491889925311876677015972621080441731498496307041669048565406241&targ=${
  "0x" + "0".repeat(0)
}&ex=2`;
const unTargetedClaimLink = `/claim/?r=0xf94b71aa3bfe0ee67b669b54d37d034092996a53120792be83d2ebfb7b92139e42ab563503f506d143c2ae9586e5a6fc808f553659eae21bcf5d6fb7e80c4b611b&d=5&ex=0&t=2&n=5495567981851992728269309841162255560633055226460333877518932494903483474665`;

// describe("Claim", () => {
//   it("Renders error heading and error subheading", () => {
//     cy.visit("/claim");
//     cy.contains("Something doesn't look right");
//     cy.contains(
//       "If you have been given a link please double check and try again"
//     );
//   });

//   it("Renders connect button if code looks reasonable", () => {
//     cy.visit(targetedClaimLink);
//     cy.contains(
//       "You will need to connect to an ethereum wallet to pay the gas and claim tokens"
//     );
//     cy.contains("Connect to an Ethereum wallet");
//   });
// });

describe("Targeted code", () => {
  it("After connecting it renders form", () => {
    cy.intercept("mocks/vesting/balance", "123");
    cy.intercept("mocks/claim/committed", "false");
    cy.intercept("mocks/claim/expired", "false");
    cy.intercept("mocks/claim/used", "false");

    cy.visit(targetedClaimLink);
    cy.contains("Connect to an Ethereum wallet").click();
    cy.get("[data-testid='claim-step-1']").should("exist");
  });
});

// describe("Untargeted code", () => {
//   it("After connecting it renders form", () => {
//     cy.visit(unTargetedClaimLink);
//     cy.contains("Connect to an Ethereum wallet").click();
//     cy.get("[data-testid='claim-step-1']").should("exist");
//     cy.get("[data-testid='claim-step-2']").should("not.exist");
//   });
// });
