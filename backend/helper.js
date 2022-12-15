const bcrypt = require("bcrypt");

// Helper functions for user authentication

function hashPassword(password) {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
}

function validatePassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}

const isUserAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send({ msg: "You are not authenticated. Please log in." });
  }
};

const isUserAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.admin) {
    next();
  } else {
    res
      .status(401)
      .send({ msg: "You are not authorized because you are not an admin." });
  }
};

module.exports = {
  hashPassword,
  validatePassword,
  isUserAuthenticated,
  isUserAdmin,
};
