const user = ({ username, email, password }) => {
  return {
    username: username.trim(),
    email: email.toLowerCase().trim(),
    password, // Debe ser el hash encriptado
    watchlist: [],
    favorites: [],
    watched: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

module.exports = { user };