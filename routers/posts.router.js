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

router.put(
  "/resume-update/:resumeId",
  authMiddleware,
  async (req, res, next) => {
    const { userId, usertitle, usermyinfo, userstatus } = req.user;
    const { resumeId } = req.params;

    const {
      title = usertitle,
      myinfo = usermyinfo,
      status = userstatus,
    } = req.body;

    const content = await prisma.contents.findFirst({
      where: {
        UserId: parseInt(userId),
        contentsId: parseInt(resumeId),
      },
    });
    if (!content) {
      return res
        .status(404)
        .json({ errorMessage: "게시글이 존재하지않습니다." });
    }

    const chgcontent = await prisma.contents.update({
      data: { title, myinfo, status },
      where: {
        UserId: parseInt(userId),
        contentsId: parseInt(resumeId),
      },
    });
    return res
      .status(200)
      .json({ message: "수정이 완료되었습니다.", data: chgcontent });
  }
);

//사용자 delete api
router.delete(
  "/resume-delete/:resumeId",
  authMiddleware,
  async (req, res, next) => {
    const { userId } = req.user;
    const { resumeId } = req.params;

    const content = await prisma.contents.findFirst({
      where: {
        UserId: parseInt(userId),
        contentsId: parseInt(resumeId),
      },
    });
    if (!content) {
      return res
        .status(404)
        .json({ errorMessage: "게시글이 존재하지않습니다." });
    }
    await prisma.contents.delete({
      where: {
        UserId: parseInt(userId),
        contentsId: parseInt(resumeId),
      },
    });
    return res.status(200).json({
      message: `id:${userId}에 ${resumeId}번게시글이 삭제가 완료되었습니다.`,
    });
  }
);

export default router;
