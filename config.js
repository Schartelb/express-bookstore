/** Common config for bookstore. */

const DB_URI = (process.env.NODE_ENV === "test")
  ? "postgresql://postgres:postgres@localhost:5432/books-test"
  : "postgresql://postgres:postgres@localhost:5432/books";


module.exports = { DB_URI };