import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { register } from "./src/controllers/auth.controller.js";
import { createPost } from "./src/controllers/posts.controller.js";
import authRouter from "./src/routes/auth.router.js";
import usersRouter from "./src/routes/users.router.js";
import postsRouter from "./src/routes/posts.router.js";
import { verifyToken } from "./middleware/auth.js";

// app
// import app from './app.js'

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // since we are using module or import statements
dotenv.config();
const app = express();
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(express.json()); // if some error
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public", "assets"))); // if some error
app.get("/assets", (req, res) => res.json({ message: "assets" }));

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL)
  .then(app.listen(PORT, () => console.log(`Server started on Port ${PORT}`)))
  .catch((error) => console.log(error));

app.use("/", (req, res) => res.json({ message: "root" }));
