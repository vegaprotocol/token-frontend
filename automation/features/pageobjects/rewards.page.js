const Page = require('./page');
class RewardsPage extends Page {
    get epochTimer() { return $('[data-testid="epoch-countdown"] > .epoch-countdown__title > p') }
    get vegaWalletKey () { return $('.reward-info > p')}
    get noRewardMsg () { return $('.reward-info > p:nth-child(3)')}
    get rewardTables () { return $('.reward-info').$$('div')}
 }

module.exports = new RewardsPage();
