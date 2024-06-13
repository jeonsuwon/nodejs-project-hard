import { AuthRepository } from "../repositories/auth.repository.js";

export class AuthService {
  authRepository = new AuthRepository();
  sighUp = async (email, hashedPassword, name, age, gender, address) => {
    const user = await this.authRepository.sighUp(
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
}
