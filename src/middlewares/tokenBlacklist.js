const tokenBlacklist = [];

const addTokenToBlacklist = (token) => {
  tokenBlacklist.push(token);
};

const isTokenBlacklisted = (token) => {
  return tokenBlacklist.includes(token);
};

module.exports = { addTokenToBlacklist, isTokenBlacklisted };
