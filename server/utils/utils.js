exports.isNotNullOrUndefined = (value) => {
  const result = (value !== null && value !== undefined);
  return result;
};

exports.isNotNullOrUndefinedOrEmpty = (value) => {
  const result = (value !== null && value !== undefined && value !== "");

  if (result && Array.isArray(value)) {
    result = value.length;
  }

  return result;
};
