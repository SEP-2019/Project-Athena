module.exports = customResponse = (response, error) => {
    let customResponse = {}
    customResponse.Response = response
    if (error != undefined) {
        customResponse.ErrorCode = error.code
        customResponse.ErrorMessage = error.message
    }
    return customResponse
}