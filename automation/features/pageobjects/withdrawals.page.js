const Page = require("./page");

class withdrawalsPage extends Page {
    get ethWalletAddressField() {
        return browser.getByTestId('current-eth-address-withdrawals');
    }

    get enableWalletAddressFieldLink() {
        return browser.getByTestId('enter-wallet-address-link')
    }
}

module.exports = new withdrawalsPage();
