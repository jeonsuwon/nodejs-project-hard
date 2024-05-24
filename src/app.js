import express from "express";
import cookieParser from "cookie-parser";
import UsersRouter from "../routers/users.router.js";

const app = express();
const PORT = 3306;

app.use(express.json());
app.use(cookieParser());
app.use("/api", [UsersRouter]);

app.get("/", (req, res, next) => {
  return res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`${PORT}포트번호가 열렸습니다.`);
});
