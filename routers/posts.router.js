import express from "express";
import authMiddleware from "../src/middlewares/auth.middleware.js";
import { prisma } from "../src/utils/prisma.util.js";

const router = express.Router();

//게시글 생성 api
router.post("/content", authMiddleware, async (req, res, next) => {
  const { userId } = req.user;
  const { title, myinfo, status } = req.body;

  const content = await prisma.contents.create({
    data: {
      UserId: userId,
      title,
      myinfo,
      status,
    },
  });
  return res.status(201).json({ data: content });
});

//게시글 목록조회 api
router.get("/contents", async (req, res, next) => {
  const content = await prisma.contents.findMany({
    select: {
      contentsId: true,
      title: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return res.status(200).json({ data: content });
});

//게시물 상세조회 api
router.get("/contents/:contentsId", async (req, res, next) => {
  const { contentsId } = req.params;
  const content = await prisma.contents.findFirst({
    where: { contentsId: +contentsId },
    select: {
      contentsId: true,
      title: true,
      myinfo: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return res.status(200).json({ data: content });
});

export default router;
