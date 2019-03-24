import history from '../../history';

function RedirectError(error) {
  console.error(error);
  return history.push({
    pathname: '/Error',
    state: { error_code: error.response.status },
  });
}

export default RedirectError;
