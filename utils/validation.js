const validation = (email, username) => {
  if (email && username) {
    return "email and username already exist";
  } else {
    if (email) {
      return "email already exist";
    }

    if (username) {
      return "username already exist";
    }
  }
};

module.exports = validation;
