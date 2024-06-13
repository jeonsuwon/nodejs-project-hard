import express from "express";
import authMiddleware from "../src/middlewares/auth.middleware.js";
import { prisma } from "../src/utils/prisma.util.js";
import { PostsController } from "../controller/posts.controller.js";

const router = express.Router();

const postsController = new PostsController();

//게시글 조회 api
router.get("/posts", postsController.getPosts);

//게시글 상세조회api
router.get("/posts/:contentsId", authMiddleware, postsController.getDetailPost);

//게시글 생성 api
router.post("/posts", authMiddleware, postsController.createPost);

//게시글 변경 api
router.put("/posts/:contentsId", authMiddleware, postsController.updatePost);

//게시글 삭제 api
router.delete("/posts/:contentsId", authMiddleware, postsController.deletePost);

export default router;
