module.exports = {
    getByTestId: function (testId) {
        return $(`[data-testid="${testId}"]`)
    }
    
}