import { prisma } from "../src/utils/prisma.util.js";

export class PostsRepository {
  //게시물 전체조회api
  findAllPosts = async () => {
    const posts = await prisma.contents.findMany();

    return posts;
  };
  //게시물 상세조회api
  findDetailPost = async (userId, contentsId) => {
    const post = await prisma.contents.findFirst({
      where: {
        UserId: +userId,
        contentsId: +contentsId,
      },
    });

    return post;
  };

  //게시물 생성api
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

  //게시물 변경api
  updatePost = async (userId, contentsId, title, myinfo) => {
    console.log(contentsId);
    const contents = await prisma.contents.findFirst({
      where: { UserId: +userId, contentsId: +contentsId },
    });
    const user = await prisma.users.findFirst({
      where: { userId: +userId },
    });

    if (!user) {
      throw new Error("User를 찾을 수 없습니다.");
    }

    const updatedPost = await prisma.contents.update({
      where: { UserId: +userId, contentsId: +contentsId },
      data: {
        title,
        myinfo,
        status: contents.status,
        createdAt: contents.createdAt,
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
    return updatedPost;
  };

  deletePost = async (userId, contentsId) => {
    const existcontents = await prisma.contents.findUnique({
      where: { UserId: +userId, contentsId: +contentsId },
    });
    console.log(existcontents);
    if (!existcontents) return existcontents;

    await prisma.contents.delete({
      where: { UserId: +userId, contentsId: +contentsId },
    });

    return true;
  };
}
