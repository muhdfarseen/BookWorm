import { bookModel } from "../models/book.model.js";
import mongoose from "mongoose";
import NodeCache from "node-cache";
const cache = new NodeCache({ stdTTL: 300 }); 


export const addBook = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, author, genre } = req.body;

    const bookExists = await bookModel.findOne({ userId, title });
    
    if (bookExists) {
      return res.status(400).json({ msg: "Book with this title already exists" });
    }

    const book = await bookModel.create({ userId, title, author, genre });
    cache.del(userId);
    res.status(201).json({ msg: "Book added successfully", book });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to add book" })
  }
};



export const getBooks = async (req, res) => {
  try {
    const userId = req.user.id;

    const cachedBooks = cache.get(userId);
    if (cachedBooks) {
      return res.status(200).json({ msg: "Books fetched from cache", data: cachedBooks });
    }

    const books = await bookModel.find({ userId });

    if (!books.length) {
      return res.status(200).json({ msg: "No books found" });
    }

    cache.set(userId, books);

    res.status(200).json({ msg: "Books fetched successfully", data: books });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


export const deleteBook = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    if (!id) return res.status(400).json({ msg: "Book ID is required" });
    
    const result = await bookModel.deleteOne({ _id: id, userId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: "Book not found" });
    }
    cache.del(userId);
    res.status(200).json({ msg: "Book deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error deleting book" });
  }
};


export const updateBook = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updatedBook = req.body;

    const updated = await bookModel.updateOne(
      { _id: id, userId },
      { ...updatedBook }
    );
    cache.del(userId);
    res.status(200).json({ msg: "Book updated successfully", result: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error updating book" });
  }
};


export const updateBookStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { currentStatus } = req.body;

    const newStatus = !currentStatus;
    await bookModel.updateOne({ _id: id, userId }, { status: newStatus });
    cache.del(userId);
    res.status(200).json({ msg: "Book status updated", newStatus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error updating status" });
  }
};


export const setBookRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { rating } = req.body;

    await bookModel.updateOne({ _id: id, userId }, { rating });
    cache.del(userId);
    res.status(200).json({ msg: "Rating updated", rating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error setting rating" });
  }
};


export const setBookReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { review } = req.body;

    await bookModel.updateOne({ _id: id, userId }, { review });
    cache.del(userId);
    res.status(200).json({ msg: "Review updated", review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error updating review" });
  }
};


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


export const getBooksAvgRating = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await bookModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$userId", averageRating: { $avg: "$rating" } } },
    ]);

    const avgRating = result[0]?.averageRating || 0;
    res.status(200).json({ avgRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error calculating average rating" });
  }
};
