import express from "express";

const app = express();
const PORT = 3306;

app.use(express.json());

app.get("/", (req, res, next) => {
  return res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`${PORT}포트번호가 열렸습니다.`);
});
