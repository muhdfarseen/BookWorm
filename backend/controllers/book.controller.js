import { bookModel } from "../models/book.model.js";
import mongoose from "mongoose";

// POST /books
export const addBook = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, author, genre, status } = req.body;

    const bookExists = await bookModel.findOne({ userId, title });
    if (bookExists) {
      return res.status(400).json({ msg: "Book with this title already exists" });
    }

    const book = await bookModel.create({ userId, title, author, genre, status });
    res.status(201).json({ msg: "Book added successfully", book });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to add book" });
  }
};

// GET /books
export const getBooks = async (req, res) => {
  try {
    const userId = req.user.id;
    const books = await bookModel.find({ userId });

    if (!books.length) {
      return res.status(404).json({ msg: "No books found" });
    }

    res.status(200).json({ msg: "Books fetched successfully", data: books });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// DELETE /books/:id
export const deleteBook = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookId = req.query.id;

    if (!bookId) return res.status(400).json({ msg: "Book ID is required" });

    const result = await bookModel.deleteOne({ _id: bookId, userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: "Book not found" });
    }

    res.status(200).json({ msg: "Book deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error deleting book" });
  }
};

// PUT /books/:id
export const updateBook = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updatedBook = req.body;

    const updated = await bookModel.updateOne(
      { _id: id, userId },
      { ...updatedBook }
    );

    res.status(200).json({ msg: "Book updated successfully", result: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error updating book" });
  }
};

// PATCH /books/:id/status
export const updateBookStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { currentStatus } = req.body;

    const newStatus = !currentStatus;
    await bookModel.updateOne({ _id: id, userId }, { status: newStatus });

    res.status(200).json({ msg: "Book status updated", newStatus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error updating status" });
  }
};

// PATCH /books/:id/rate
export const setBookRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { rating } = req.body;

    await bookModel.updateOne({ _id: id, userId }, { rating });
    res.status(200).json({ msg: "Rating updated", rating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error setting rating" });
  }
};

// PATCH /books/:id/review
export const setBookReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { review } = req.body;

    await bookModel.updateOne({ _id: id, userId }, { review });
    res.status(200).json({ msg: "Review updated", review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error updating review" });
  }
};

// GET /books/ratings
export const getBookRatings = async (req, res) => {
  try {
    const userId = req.user.id;
    const books = await bookModel.find({ userId });

    const ratings = books.map(({ _id, title, rating }) => ({
      bookId: _id,
      title,
      rating,
    }));

    res.status(200).json({ msg: "Ratings fetched", data: ratings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching ratings" });
  }
};

// GET /books/average-rating
export const getBooksAvgRating = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await bookModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$userId", averageRating: { $avg: "$rating" } } },
    ]);

    const avgRating = result[0]?.averageRating || 0;
    res.status(200).json({ msg: "Average rating calculated", avgRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error calculating average rating" });
  }
};
