exports.createError = async (status, message) => {
  const error = new Error();
  error.status = status || 500;
  error.message = message;
  return error;
};
