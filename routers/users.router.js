import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../src/utils/prisma.util.js";
import authMiddleware from "../src/middlewares/auth.middleware.js";
import dotenv from "dotenv";
import { AuthController } from "../controller/auth.controller.js";

const router = express.Router();
dotenv.config();

const authController = new AuthController();

const secretkey = process.env.SECRET_KEY;
// 회원가입
router.post("/sign-up", authController.signUp);

//로그인 api구현
router.post("/sign-in", authController.signIn);

//사용자 조회 API
router.get("/user", authMiddleware, authController.findUser);

//사용자 정보 업데이트 API
router.put("/user", authMiddleware, authController.updateUser);

//사용자 정보 삭제
router.delete("/user", authMiddleware, authController.deleteUser);

//사용자 delete api
router.delete("/user-info-delete", authMiddleware, async (req, res, next) => {
  const { userId } = req.user;

  const user = await prisma.users.findFirst({
    where: { userId: parseInt(userId) },
  });
  if (!user) {
    return res.status(404).json({ errorMessage: "게시글이 존재하지않습니다." });
  }
  await prisma.users.delete({
    where: {
      userId: parseInt(userId),
    },
  });
  return res.status(200).json({ message: "게시글 삭제가 완료되었습니다." });
});

export default router;
