import express from "express";
import { addPost, deletePost, getPost, getPosts, updatePost } from "../controllers/posts.js";

const router = express.Router()

router.get("/", getPosts)//get all posts
router.get("/:id", getPost)//get post with id 
router.post("/", addPost)//create new post
router.delete("/:id", deletePost)//delete specific post using id
router.put("/:id", updatePost)//update a post

export default router;