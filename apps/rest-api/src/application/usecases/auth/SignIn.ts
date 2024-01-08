import { IRefreshTokenRepository } from '@/application/repositories/IRefreshTokenRepository';
import { IUserRepository } from '@/application/repositories/IUserRepository';
import { generateTokens } from '@/utils/auth/jtw';
import { comparePassword } from '@/utils/auth/password';
import { hashToken } from '@/utils/auth/token';
import { generateUUID } from '@/utils/auth/uuid';

export class SignIn {
  constructor(
    private repository: IUserRepository,
    private refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(params: { email: string; password: string }) {
    const existsUser = await this.repository.findByEmail({ email: params.email });
    if (!existsUser) {
      throw new Error('Email not found');
    }

    const validPassword = await comparePassword(params.password, existsUser.hashedPassword);
    if (!validPassword) {
      throw new Error('Password is invalid');
    }

    const uuid = await generateUUID();
    const { accessToken, refreshToken } = generateTokens(existsUser.id, uuid);
    const hashedToken = await hashToken(refreshToken);

    await this.refreshTokenRepository.create({
      uuid: uuid,
      hashedToken: hashedToken,
      userId: existsUser.id,
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
