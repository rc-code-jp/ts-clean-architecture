import { UserModel } from '@/domain/models/UserModel';

export interface IUserRepository {
  findByEmail(params: { email: string }): Promise<UserModel | null>;
  findById(params: { id: number }): Promise<UserModel | null>;
  create(params: { email: string; hashedPassword: string; name: string }): Promise<UserModel>;
}
