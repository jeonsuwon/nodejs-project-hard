import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../src/utils/prisma.util.js";
import authMiddleware from "../src/middlewares/auth.middleware.js";

const router = express.Router();

//email 정규식화
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 생성 API

router.post("/sign-up", async (req, res, next) => {
  try {
    const {
      email,
      password,
      checkpassword,
      name,
      age,
      gender,
      status = "APPLICANT",
      address,
    } = req.body;

    //필수 검증
    if (!email)
      return res.status(400).json({ errorMessage: "email 작성이 필요합니다." });
    if (!password)
      return res
        .status(400)
        .json({ errorMessage: "password 작성이 필요합니다." });
    if (!checkpassword)
      return res
        .status(400)
        .json({ errorMessage: "checkpassword 작성이 필요합니다." });
    if (!name)
      return res.status(400).json({ errorMessage: "name 작성이 필요합니다." });
    if (!age)
      return res.status(400).json({ errorMessage: "age 작성이 필요합니다." });
    if (!gender)
      return res
        .status(400)
        .json({ errorMessage: "gender 작성이 필요합니다." });
    if (!status)
      return res
        .status(400)
        .json({ errorMessage: "status 작성이 필요합니다." });
    if (!address)
      return res
        .status(400)
        .json({ errorMessage: "address 작성이 필요합니다." });

    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ errorMessage: "유효하지 않은 이메일 형식입니다." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ errorMessage: "비밀번호는 최소 6자 이상이어야 합니다." });
    }

    const validStatuses = ["APPLICANT", "RECRUITER"];
    if (!validStatuses.includes(status.toUpperCase())) {
      return res
        .status(400)
        .json({ errorMessage: "APPLICANT or RECRUITER으로 작성해주세요" });
    }

    const validGenders = ["MALE", "FEMALE"];
    if (!validGenders.includes(gender.toUpperCase())) {
      return res
        .status(400)
        .json({ errorMessage: "MALE or FEMALE로 작성해주세요." });
    }

    if (password !== checkpassword)
      return res
        .status(400)
        .json({ errorMessage: "checkpassword 확인이 필요합니다." });

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
        status: status.toUpperCase(),
        address,
      },
    });
    return res
      .status(201)
      .json({ message: "회원가입이 완료가 되었습니다.", data: userinfo });
  } catch (err) {
    next(err);
  }
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

//사용자 조회 API

router.get("/user-details", authMiddleware, async (req, res, next) => {
  //1. 클라이언트가 ** 로그인된 사용자인 검증**합니다.
  const { userId } = req.user;

  //2. 사용자를 조회할 때, 1:1 관계를 맺고 있는 **Users**와 **UserInfos** 테이블을 조회합니다.
  const user = await prisma.users.findFirst({
    where: { userId: +userId },
    //특정 컬럼만 조회하는 파라미터
    select: {
      userId: true,
      email: true,
      password: false,
      createdAt: true,
      updatedAt: true,
      // UserInfos 함께 조회되는 JOIN 문법을 사용한다 .
      UserInfos: {
        select: {
          name: true,
          age: true,
          gender: true,
          address: true,
        },
      },
    },
  });
  //3.조회한 사용자의 상세한 정보를 클라이언트에게 반환합니다.
  return res.status(200).json({ data: user });
});

//사용자 업데이트 api
router.put("/user-info-update", authMiddleware, async (req, res, next) => {
  const { userId, username, userage, usergender, useraddress } = req.user;

  const {
    name = username,
    age = userage,
    gender = usergender,
    address = useraddress,
  } = req.body;

  const user = await prisma.userInfos.findFirst({
    where: { UserId: parseInt(userId) },
  });
  if (!user) {
    return res.status(404).json({ errorMessage: "게시글이 존재하지않습니다." });
  }

  const userInfo = await prisma.userInfos.update({
    data: { name, age, gender, address },
    where: {
      UserId: parseInt(userId),
    },
  });
  return res
    .status(200)
    .json({ message: "수정이 완료되었습니다.", data: userInfo });
});

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
