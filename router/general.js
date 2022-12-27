const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Please provide user name and password both" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //res.send(JSON.stringify({ books }, null, 4));

  let getBooks = new Promise((resolve, reject) => {
    try {
      const data = books;
      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
  getBooks.then(
    (data) => res.send(data),
    (err) => res.send(`There was an error in getting data: ${err}`)
  );
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  let selectedIsbn;

  let selectBook = new Promise((resolve, reject) => {
    try {
      for (let x in books) {
        if (x === isbn) {
          selectedIsbn = x;
          resolve(books[selectedIsbn]);
        }
      }
    } catch (err) {
      reject(err);
    }
  });

  if (!selectedIsbn) {
    res.send("Unable to find books with the ISBN");
  }

  selectBook.then(
    (data) => res.send(data),
    (err) => res.send(`There was an error in finding books with ISBN: ${err}`)
  );
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  let author = req.params.author;
  let selectedBooks = [];

  let selectBook = new Promise((resolve, reject) => {
    try {
      Object.values(books).forEach((val) => {
        if (val.author === author) {
          selectedBooks.push(val);
        }
      });

      if (selectedBooks.length === 0) {
        resolve("Unable to find books with the author name");
      } else {
        resolve(selectedBooks);
      }
      resolve(selectedBooks);
    } catch (err) {
      reject(err);
    }
  });

  selectBook.then(
    (data) => res.send(data),
    (err) => res.send(`There was an error in finding books with the author name: ${err}`)
  );
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let title = req.params.title;
  let selectedBooks = [];

  let selectBook = new Promise((resolve, reject) => {
    try {
      Object.values(books).forEach((val) => {
        if (val.title === title) {
          selectedBooks.push(val);
        }
      });

      if (selectedBooks.length === 0) {
        resolve("Unable to find books with the title");
      } else {
        resolve(selectedBooks);
      }
      resolve(selectedBooks);
    } catch (err) {
      reject(err);
    }
  });

  selectBook.then(
    (data) => res.send(data),
    (err) => res.send(`There was an error in finding books with the title: ${err}`)
  );
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  let selectedIsbn;

  for (let x in books) {
    if (x === isbn) {
      selectedIsbn = x;
      // console.log(books[x]);
      let reviews = books[x].reviews;
      let numberOfReviews = Object.keys(reviews).length;
      if (numberOfReviews === 0) {
        res.send("No reviews yet");
      } else {
        res.send(reviews);
      }
    }
  }
  if (!selectedIsbn) {
    res.send("Unable to find reviews with the ISBN");
  }
});

module.exports.general = public_users;
