module.exports = customResponse = (response, error) => {
  let customResponse = {};
  customResponse.Response = response;
  if (error != undefined) {
    customResponse.ErrorMessage = error.message;
  }
  return customResponse;
};
