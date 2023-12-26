import { jsonResponse } from '@/infrastructure/http/utils/responses';
import { AuthController } from '@/interfaces/controllers/AuthController';
import { createFactory } from 'hono/factory';
import { postSignUpValidation, refreshTokenValidation } from '../../validators/auth';

const factory = createFactory();

/**
 * トークンをリフレッシュする
 */
export const postRefreshToken = factory.createHandlers(refreshTokenValidation, async (c) => {
  const body = c.req.valid('json');

  const authController = new AuthController();
  const res = await authController.refreshToken({
    refreshToken: body.refreshToken,
  });

  return jsonResponse(
    JSON.stringify({
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
    }),
  );
});
