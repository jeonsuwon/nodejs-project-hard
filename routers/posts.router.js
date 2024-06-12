import express from "express";
import authMiddleware from "../src/middlewares/auth.middleware.js";
import { prisma } from "../src/utils/prisma.util.js";
import { PostsController } from "../controller/posts.controller.js";

const router = express.Router();

const postsController = new PostsController();

//게시글 생성 api
router.post("/posts", authMiddleware, postsController.createPost);

//게시글 조회 api
router.get("/posts", postsController.getPosts);

// // 게시글 생성 api
// router.post("/resume-create", authMiddleware, async (req, res, next) => {
//   const { userId } = req.user;
//   const { title, myinfo, status = "APPLY" } = req.body;

//   if (!title)
//     return res.status(400).json({ errorMessage: "title 작성이 필요합니다." });
//   if (!myinfo)
//     return res.status(400).json({ errorMessage: "myinfo 작성이 필요합니다." });

//   const validStatuses = [
//     "APPLY",
//     "DROP",
//     "PASS",
//     "INTERVIEW1",
//     "INTERVIEW2",
//     "FINAL_PASS",
//   ];
//   if (!validStatuses.includes(status.toUpperCase())) {
//     return res.status(400).json({
//       errorMessage:
//         "DROP, PASS, INTERVIEW1, INTERVIEW2, FINAL_PASS 으로 작성해주세요",
//     });
//   }

//   const content = await prisma.contents.create({
//     data: {
//       UserId: userId,
//       title,
//       myinfo,
//       status,
//     },
//   });
//   return res.status(201).json({ data: content });
// });

// //게시글 목록조회 api
// router.get("/resume-info", async (req, res, next) => {
//   const content = await prisma.contents.findMany({
//     select: {
//       contentsId: true,
//       UserId: true,
//       title: true,
//       status: true,
//       createdAt: true,
//       updatedAt: true,
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//   });
//   if (!content) {
//     return res
//       .status(400)
//       .json({ errorMessage: "작성하신 게시글이 없습니다. 확인해주세요." });
//   }
//   return res.status(200).json({ data: content });
// });

//게시물 상세조회 api
router.get(
  "/resume-details/:resumeId",
  authMiddleware,
  async (req, res, next) => {
    const { userId } = req.user;
    const { resumeId } = req.params;

    const content = await prisma.contents.findFirst({
      where: {
        UserId: parseInt(userId),
        contentsId: +resumeId,
      },
      select: {
        UserId: true,
        contentsId: true,
        title: true,
        myinfo: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!content) {
      return res
        .status(400)
        .json({ errorMessage: "작성하신 게시글이 없습니다. 확인해주세요." });
    }
    return res.status(200).json({ data: content });
  }
);

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
