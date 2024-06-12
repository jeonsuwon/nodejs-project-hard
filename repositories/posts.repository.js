import { prisma } from "../src/utils/prisma.util.js";

export class PostsRepository {
  findAllPosts = async () => {
    const posts = await prisma.contents.findMany();

    return posts;
  };

  createPost = async (userId, title, myinfo, status) => {
    const user = await prisma.users.findFirst({
      where: { userId: +userId },
    });

    if (!user) {
      throw new Error("User를 찾을 수 없습니다.");
    }

    const createdPost = await prisma.contents.create({
      data: {
        title,
        myinfo,
        status,
        createdAt: new Date(),
        updatedAt: new Date(),
        User: {
          connectOrCreate: {
            where: { userId: user.userId },
            create: {
              email: user.email,
              checkpassword: user.checkpassword,
              password: user.password,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
            },
          },
        },
      },
    });
    return createdPost;
  };
}
