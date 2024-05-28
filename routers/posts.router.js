import express from "express";
import authMiddleware from "../src/middlewares/auth.middleware.js";
import { prisma } from "../src/utils/prisma.util.js";

const router = express.Router();

//게시글 생성 api
router.post("/content", authMiddleware, async (req, res, next) => {
  const { userId } = req.user;
  const { title, myinfo } = req.body;

  const content = await prisma.contents.create({
    data: {
      UserId: userId,
      title,
      myinfo,
    },
  });
  return res.status(201).json({ data: content });
});

export default router;
