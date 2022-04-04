const Page = require("./page");

class StakingPage extends Page {
    get validatorListTestId () {return 'node-list-item'}

    get etherscanLink() {return browser.getByTestId('etherscan-link')}

    get pendingTransactionsBtn() {return browser.getByTestId('pending-transactions-btn')}

    get pendingTransactionsModalStatus() {return $('.transactions-modal__status')}
    
    get associateMoreTokensBtn () {return browser.getByTestId('associate-more-tokens-btn')}

    get associateTokensBtn() {return browser.getByTestId('associate-tokens-btn')}

    get disassociateTokensBtn() {return browser.getByTestId("disassociate-tokens-btn")}

    get calloutContainer() {return browser.getByTestId('callout')}

    get walletRadioBtn() {return browser.getByTestId('associate-radio-wallet')}

    get vestingContractRadioBtn() {return browser.getByTestId('associate-radio-contract')}

    get tokenAmountInputField() {return browser.getByTestId('token-amount-input')}

    get tokenAmountSubmitBtn() {return browser.getByTestId('token-input-submit-button')}

    get backToStakingPageBtn() {return browser.getByTestId('back-to-staking-link')}

    get removeStakeNowBtn () {return browser.getByTestId('remove-stake-now-btn')}
    
    get removeStakeNowDisclaimerText () {return browser.getByTestId('remove-stake-now-disclaimer')}

    associateTokensThroughWallet() {
      this.calloutContainer.waitForDisplayed({timeout:30000,reverse:false,timeoutMsg: "callout was not found"})
      browser.pause(1000)
      if (this.associateMoreTokensBtn.isDisplayed()){
         this.associateMoreTokensBtn.click()
        } else this.associateTokensBtn.click()
      this.walletRadioBtn.click({force:true})
      this.tokenAmountInputField.setValue(0.00001)
      this.tokenAmountSubmitBtn.click()
      browser.waitUntil(() => browser.getWindowHandles().length > 1);
      browser.switchWindow("MetaMask Notification");
      $('button=Confirm').click()
      browser.switchWindow("VEGA");
      browser.pause(2000)
    }

    associateTokensThroughVestingContract() {
      this.calloutContainer.waitForDisplayed({timeout:30000,reverse:false,timeoutMsg: "callout was not found"})
      browser.pause(1000)
      if (this.associateMoreTokensBtn.isDisplayed()){
          this.associateMoreTokensBtn.click()
        } else this.associateTokensBtn.click()
      this.vestingContractRadioBtn.click({force:true})
      this.tokenAmountInputField.setValue(0.00001)
      this.tokenAmountSubmitBtn.click()
      browser.waitUntil(() => browser.getWindowHandles().length > 1);
      browser.switchWindow("MetaMask Notification");
      $('button=Confirm').click()
      browser.switchWindow("VEGA");
      browser.pause(2000)
    }


    disassociateTokensThroughWallet() {
      this.calloutContainer.waitForDisplayed({timeout:30000,reverse:false,timeoutMsg: "callout was not found"})
      browser.pause(1000)
      this.disassociateTokensBtn.waitForDisplayed({timeout:30000,reverse:false,timeoutMsg: "disassociate btn  was not found"})
      this.disassociateTokensBtn.click()
      this.walletRadioBtn.click({force:true})
      this.tokenAmountInputField.setValue(0.00001)
      this.tokenAmountSubmitBtn.click()
      browser.waitUntil(() => browser.getWindowHandles().length > 1);
      browser.switchWindow("MetaMask Notification");
      $('button=Confirm').click()
      browser.switchWindow("VEGA");
      browser.pause(2000)
    }

    disassociateTokensThroughVestingContract() {
      this.calloutContainer.waitForDisplayed({timeout:30000,reverse:false,timeoutMsg: "callout was not found"})
      this.disassociateTokensBtn.waitForDisplayed({timeout:30000,reverse:false,timeoutMsg: "disassociate btn  was not found"})
      this.disassociateTokensBtn.click()
      browser.pause(1000)
      this.vestingContractRadioBtn.click({force:true})
      this.tokenAmountInputField.setValue(0.00001)
      this.tokenAmountSubmitBtn.click()
      browser.waitUntil(() => browser.getWindowHandles().length > 1);
      browser.switchWindow("MetaMask Notification");
      $('button=Confirm').click()
      browser.switchWindow("VEGA");
      browser.pause(2000)
    }
}

module.exports = new StakingPage();