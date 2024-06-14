import { AuthService } from "../service/auth.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const secretkey = process.env.SECRET_KEY;

export class AuthController {
  authService = new AuthService();
  signUp = async (req, res, next) => {
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

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.authService.signUp(
        email,
        hashedPassword,
        name,
        age,
        gender,
        address
      );

      if (user === false)
        return res.status(400).json({ message: "사용하고있는 이메일입니다 ." });

      return res
        .status(200)
        .json({ message: "정상적으로 회원가입에 완료되었습니다.", data: user });
    } catch (err) {
      next(err);
    }
  };

  signIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await this.authService.signIn(email, password);

      if (!(await bcrypt.compare(password, user.password))) {
        return res
          .status(400)
          .json({ errorMessage: "비밀번호가 일치하지 않습니다." });
      }

      const token = jwt.sign(
        {
          userId: user.userId,
        },
        secretkey // 비밀 키 , dotenv를 이용해서, 외부에서 코드를 보더라도, 알 수 없도록 구현해야함
      );
      res.cookie("authorization", `Bearer ${token}`);
      return res.status(200).json({
        message: `환영합니다 ${user.email}으로 정상적으로 로그인되었습니다.`,
      });
    } catch (err) {
      next(err);
    }
  };

  findUser = async (req, res, next) => {
    try {
      const { userId } = req.user;
      console.log(userId);
      const user = await this.authService.findUser(userId);

      return res.status(200).json({
        message: "정상적으로 확인되었습니다.",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  };

  updateUser = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { name, gender, age, address } = req.body;
      const user = await this.authService.updateUser(
        userId,
        name,
        gender,
        age,
        address
      );
      return res.status(200).json({
        message: "정상적으로 변경되었습니다.",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  };

  //사용자정보삭제
  deleteUser = async (req, res, next) => {
    const { userId } = req.user;

    const user = await this.authService.deleteUser(userId);

    return res.status(200).json({
      message: "정상적으로 삭제되었습니다.",
      data: user,
    });
  };
}
