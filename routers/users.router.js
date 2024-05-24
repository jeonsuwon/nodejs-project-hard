import express from "express";
import { prisma } from "../src/utils/prisma.util.js";

const router = express.Router();

router.post("/sign-up", async (req, res, next) => {
  const { email, password, name, age, gender, status, address } = req.body;

  const isExistUser = await prisma.users.findFirst({
    where: { email },
  });

  if (isExistUser) {
    return res
      .status(409)
      .json({ errorMessage: "이미 존재하는 이메일입니다." });
  }

  const user = await prisma.users.create({
    data: {
      email,
      password,
    },
  });

  const userinfo = await prisma.userInfos.create({
    data: {
      UserId: user.userId,
      name,
      age,
      gender: gender.toUpperCase(), //전달받은 gender body를 대문자로 치환한다.
      status,
      address,
    },
  });
  return res.status(201).json({ message: "회원가입이 완료가 되었습니다." });
});

export default router;
