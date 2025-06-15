import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  addBook,
  getBooks,
  deleteBook,
  updateBook,
  updateBookStatus,
  setBookRating,
  setBookReview,
  getBookRatings,
  getBooksAvgRating,
} from "../controllers/book.controller.js";

const router = express.Router();

// Middleware to authenticate requests
router.use(authenticate);

// Books
router.route("/").get(getBooks).post(addBook).delete(deleteBook);
router.route("/:id").put(updateBook);

// Status, Rating, Review
router.patch("/:id/status", updateBookStatus);
router.patch("/:id/rate", setBookRating);
router.patch("/:id/review", setBookReview);

// Extra
router.get("/ratings", getBookRatings);
router.get("/average-rating", getBooksAvgRating);

export const bookRouter = router;