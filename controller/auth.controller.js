import { AuthService } from "../service/auth.service.js";
import bcrypt from "bcrypt";

export class AuthController {
  authService = new AuthService();
  sighUp = async (req, res, next) => {
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

      const user = await this.authService.sighUp(
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
}
