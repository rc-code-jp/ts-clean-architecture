import { IRefreshTokenRepository } from '@/application/repositories/IRefreshTokenRepository';
import { IUserRepository } from '@/application/repositories/IUserRepository';
import { generateTokens, verifyToken } from '@/utils/auth/jtw';
import { comparePassword } from '@/utils/auth/password';
import { hashToken } from '@/utils/auth/token';
import { generateUUID } from '@/utils/auth/uuid';

export class RefreshToken {
  constructor(
    private repository: IUserRepository,
    private refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(params: { refreshToken: string }) {
    const payload = verifyToken(params.refreshToken);
    const savedRefreshToken = await this.refreshTokenRepository.findByUuid(payload.jti);

    if (!savedRefreshToken || savedRefreshToken.revoked) {
      throw new Error('Unauthorized');
    }

    const hashedToken = hashToken(params.refreshToken);
    if (hashedToken !== savedRefreshToken.hashedToken) {
      throw new Error('Unauthorized');
    }

    const user = await this.repository.findById({
      id: savedRefreshToken.userId,
    });

    if (!user) {
      throw new Error('Unauthorized');
    }

    await this.refreshTokenRepository.delete({
      uuid: savedRefreshToken.uuid,
    });

    const uuid = generateUUID();
    const { accessToken, refreshToken } = generateTokens(user.id, uuid);

    await this.refreshTokenRepository.create({
      uuid: uuid,
      refreshToken: refreshToken,
      userId: user.id,
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
