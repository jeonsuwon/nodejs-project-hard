import jwt from "jsonwebtoken";

export default async function (req, res, next) {
  try {
    const { authorization } = req.cookie;

    const [tokenType, token] = authorization.split(" ");
    if (tokenType !== "Bearer")
      throw new Error("토큰 타입이 일치하지 않습니다.");

    const decodeToken = jwt.verify(token, "customized_secret_key");

    const userId = decodeToken.userId;
  } catch (error) {
    res.claerCookie("authorization");
    switch (error.name) {
      case "TokenExpiredError": // 토큰이 만료되었을 경우에 발생하는 에러
        return res.status(401).json({ message: "토큰이 만료되었습니다." });
        break;
      case "JsonWebTokenError": // 토큰 인증에 실패했을 경우에, 발생하는 에러
        return res.status(401).json({ message: "토큰인증에 실패하였습니다.." });
        break;
      default:
        return res
          .status(401)
          .json({ message: error.message ?? "비 정상적인 요청입니다." });
    }
  }
}
