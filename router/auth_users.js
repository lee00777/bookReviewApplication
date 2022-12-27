const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  let validUsers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validUsers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Please provide user name and password" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password again" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let username = req.session.authorization.username;
  let review = req.query.review;
  let isbn = req.params.isbn;
  let selectedIsbn;

  if (!review) {
    res.send(`Please provide a review`);
  }

  for (let x in books) {
    if (x === isbn) {
      selectedIsbn = x;
      books[x].reviews[username] = review;
      res.send(`Your review ${review} is successfully registered`);
    }
  }
  if (!selectedIsbn) {
    res.send("Unable to find reviews with the ISBN");
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let username = req.session.authorization.username;
  let isbn = req.params.isbn;
  let selectedIsbn;

  for (let x in books) {
    if (x === isbn) {
      selectedIsbn = x;
    }
  }

  if (!selectedIsbn) {
    res.send("Unable to find reviews with the ISBN");
  }

  Object.keys(books[selectedIsbn].reviews).forEach((reviewer) => {
    if (reviewer === username) {
      let review = books[selectedIsbn].reviews[username];
      delete books[selectedIsbn].reviews[username];
      res.send(`Your review ${review} was deleted`);
    } else {
      res.send(`You can't delete this review as you are not the reviewer`);
    }
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
