import express from "express";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";

const app = express()

// Configure CORS
const corsOptions = {
    origin: 'http://localhost:5173', // Specify the allowed origin
    credentials: true, // Allow credentials (cookies, etc.)
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../client/public/upload')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname)
    }
})
  
const upload = multer({ storage })

app.post('/api/upload', upload.single('file'), function (req, res) {
    // req.file is the name of your file in the form above, here 'file'
    // req.body will hold the text fields, if there were any 
    const file = req.file;
    res.status(200).json(file.filename);
});

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
//create route to upload files to database using multer

app.listen(8800, () => {
    console.log("Connected")
})