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

router.use(authenticate);

router.route("/").get(getBooks).post(addBook);
router.route("/:id").put(updateBook).delete(deleteBook);
router.patch("/:id/status", updateBookStatus);
router.patch("/:id/rate", setBookRating);
router.patch("/:id/review", setBookReview);
router.get("/ratings", getBookRatings);
router.get("/average-rating", getBooksAvgRating);

export const bookRouter = router;