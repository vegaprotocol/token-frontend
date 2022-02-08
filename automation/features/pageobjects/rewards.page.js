const Page = require('./page');
class RewardsPage extends Page {
    get epochTimer() { return $('[data-testid="epoch-countdown"] > .epoch-countdown__title > p') }
    get vegaWalletKey () { return $('.reward-info > p')}
 }

module.exports = new RewardsPage();
