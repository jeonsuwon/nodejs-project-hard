import { prisma } from "../src/utils/prisma.util.js";

export class AuthRepository {
  signUp = async (email, hashedPassword, name, age, gender, address) => {
    const isExistUser = await prisma.users.findFirst({
      where: { email },
    });
    if (isExistUser) return false;

    const createduser = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    const createdUserInfo = await prisma.userInfos.create({
      data: {
        UserId: createduser.userId,
        name,
        age,
        gender: gender.toUpperCase(),
        address,
      },
    });
    return createdUserInfo;
  };

  signIn = async (email) => {
    const user = await prisma.users.findFirst({
      where: { email },
    });
    return user;
  };

  findUser = async (userId) => {
    const user = await prisma.userInfos.findFirst({
      where: { UserId: +userId },
    });
    return user;
  };

  updateUser = async (userId, name, gender, age, address) => {
    const user = await prisma.userInfos.findFirst({
      where: { Userid: +userId },
      data: {
        userId,
        userInfosId: user.userInfosId,
        name,
        address,
        age,
        gender,
        updatedAt: new Date(),
      },
    });
    return user;
  };
}
