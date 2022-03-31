class Page {
    get vestingLink() {
        return $("Vesting");
    }
    get stakingLink() {
        return $("Staking");
    }
    get rewardsLink() {
        return $("Rewards");
    }
    get withdrawLink() {
        return $("Withdraw");
    }
    get governanceLink() {
        return $("Governance");
    }
    get liquidityLink() {
        return $("DEX Liquidity");
    }
    get notFoundUrl() {
        return "not-found";
    }
    get notFoundText() {
        return "This page can not be found, please check the URL and try again.";
    }
    get connectVegaWalletTestId() {
        return "connect-vega";
    }
    get hostedWalletInput() {
        return $('Input[name="hostedWallet"]');
    }
    get vegaWalletUserNameTestId() {
        return "wallet-name";
    }
    get vegaWalletPasswordTestId() {
        return "wallet-password";
    }
    get vegaWalletLoginTestId() {
        return "wallet-login";
    }
    get connectEthWallet() {
        return $("[data-test-id='connect-to-eth-wallet-button']");
    }
    get disconnectWalletBtn() {
        return $$(".button-link=Disconnect");
    } //TODO add test id
    get connectMetaMask() {
        return $(".web3modal-provider-name*=Injected");
    }

    goTo(path) {
        browser.url(path);
    }

    connectToEthWallet() {
        this.connectEthWallet.click();
        this.connectMetaMask.click();
    }
}

module.exports = Page;
