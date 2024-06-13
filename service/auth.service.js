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
      email: user.email,
      password: user.password,
    };
  };
}
