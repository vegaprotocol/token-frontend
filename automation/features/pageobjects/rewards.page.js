const Page = require('./page');
class RewardsPage extends Page {
    get epochTimerTitle() { return $('[data-testid="epoch-countdown"] > .epoch-countdown__title > p') }
    get epochRewardsCountdownTimer() {return browser.getByTestId('epoch-countdown')}
    get vegaWalletKey () { return $('.reward-info > p')}
    get noRewardMsg () { return $('.reward-info > p:nth-child(3)')}
    get rewardTables () { return $('.reward-info').$$('div')}
    get vegaWalletConnectBtn () { return browser.getByTestId('connect-to-vega-wallet-btn')}
 }

module.exports = new RewardsPage();



