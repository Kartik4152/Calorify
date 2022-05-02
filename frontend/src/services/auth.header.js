const authHeader = () => {
  const jwt =
    JSON.parse(sessionStorage.getItem("jwt")) ||
    JSON.parse(localStorage.getItem("jwt"));
  if (jwt) {
    return {
      "Content-Type": "application/json",
      Authorization: `bearer ${jwt}`,
    };
  }
  return {};
};

export default authHeader;
