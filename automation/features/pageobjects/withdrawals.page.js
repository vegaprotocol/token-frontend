const Page = require("./page");

class withdrawalsPage extends Page {
<<<<<<< HEAD
  get ethWalletAddressField() {
    return browser.getByTestId("current-eth-address-withdrawals");
  }

  get enableWalletAddressFieldLink() {
    return browser.getByTestId("enter-wallet-address-link");
  }
=======
    get ethWalletAddressField() {
        return browser.getByTestId('current-eth-address-withdrawals');
    }

    get enableWalletAddressFieldLink() {
        return browser.getByTestId('enter-wallet-address-link')
    }
>>>>>>> 342c254ed5998f13110d8db01057b47ff01b44ff
}

module.exports = new withdrawalsPage();
