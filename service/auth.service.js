import { AuthRepository } from "../repositories/auth.repository.js";

export class AuthService {
  authRepository = new AuthRepository();
  signUp = async (email, hashedPassword, name, age, gender, address) => {
    const user = await this.authRepository.signUp(
      email,
      hashedPassword,
      name,
      age,
      gender,
      address
    );

    if (user === false) return false;

    return {
      userId: user.UserId,
      name: user.name,
      age: user.age,
      gender: user.gender,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  };

  signIn = async (email) => {
    const user = await this.authRepository.signIn(email);

    return {
      userId: user.userId,
      email: user.email,
      password: user.password,
    };
  };

  findUser = async (userId) => {
    const user = await this.authRepository.findUser(userId);
    return user;
  };

  updateUser = async (userId, name, gender, age, address) => {
    const user = await this.authRepository.updateUser(
      userId,
      name,
      gender,
      age,
      address
    );
    return user;
  };

  deleteUser = async (userId) => {
    const user = await this.authRepository.deleteUser(userId);
    console.log("seruser:" + user);
    return user;
  };
}
