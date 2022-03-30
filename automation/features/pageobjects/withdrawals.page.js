const Page = require("./page");

class WithdrawalsPage extends Page {
  get ethWalletAddressField() {
    return $$('[data-testid="token-amount-input"]');
  }

  get enableWalletAddressFieldLink() {
    return browser.getByTestId('enter-wallet-address-link')
  } 
}

module.exports = new WithdrawalsPage();
