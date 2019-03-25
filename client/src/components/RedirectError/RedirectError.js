import history from '../../history';

function RedirectError(error) {
  console.error(error);
  if (error.response) {
    return history.push({
      pathname: '/Error',
      state: {
        error_code: error.response.status,
        error_message: error.message,
      },
    });
  } else {
    return history.push({
      pathname: '/Error',
      state: {
        error_code: '500',
        error_message: error.message,
      },
    });
  }
}

export default RedirectError;
