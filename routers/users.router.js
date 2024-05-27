import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../src/utils/prisma.util.js";

const router = express.Router();

// 생성 API

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

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.users.create({
    data: {
      email,
      password: hashedPassword,
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

//사용자 로그인 API구현

router.post("/sign-in", async (req, res, next) => {
  const { email, password } = req.body;

  const user = await prisma.users.findFirst({
    where: { email },
  });
  if (!user) {
    return res
      .status(401)
      .json({ errorMessage: "등록되어있지 않는 이메일입니다." });
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return res
      .status(401)
      .json({ errorMessage: "비밀번호가 일치하지 않습니다." });
  }

  //로그인에 성공한다면, 사용자에게 JWT를 발급합니다.
  const token = jwt.sign(
    {
      userId: user.userId,
    },
    "customized_secret_key" // 비밀 키 , dotenv를 이용해서, 외부에서 코드를 보더라도, 알 수 없도록 구현해야함
  );
  res.cookie("authorization", `Bearer ${token}`);
  return res.status(200).json({ message: "로그인 성공했습니다." });
});

export default router;
