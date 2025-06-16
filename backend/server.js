import express, { json, urlencoded } from "express";
import { connectDB } from "./config/db.js";
import { userRouter } from "./routes/user.routes.js";
import { bookRouter } from "./routes/book.routes.js";
import cors from "cors";

const app = express();

connectDB();

const corsOptions = {
  origin: "http://localhost:8081",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});
