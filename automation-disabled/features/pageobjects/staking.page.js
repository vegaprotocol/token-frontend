const Page = require("./page");

class VestingPage extends Page {
    get validatorListTestId () {return 'node-list-item'}
}

module.exports = new VestingPage();