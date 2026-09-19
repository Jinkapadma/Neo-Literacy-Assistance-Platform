import { AuthService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { env } from '../config/env.js';

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await AuthService.register(req.body);

  res.cookie('refreshToken', refreshToken, cookieOptions);

  return ApiResponse.created(res, { user, accessToken }, 'Learner registration successful!');
});

export const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await AuthService.login(req.body);

  res.cookie('refreshToken', refreshToken, cookieOptions);

  return ApiResponse.success(res, { user, accessToken }, 'Logged in successfully!');
});

export const refresh = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  const { accessToken, refreshToken: newRefreshToken, user } = await AuthService.refreshAccessToken(incomingRefreshToken);

  res.cookie('refreshToken', newRefreshToken, cookieOptions);

  return ApiResponse.success(res, { user, accessToken }, 'Token refreshed successfully');
});

export const logout = asyncHandler(async (req, res) => {
  if (req.user?._id) {
    await AuthService.logout(req.user._id);
  }

  res.clearCookie('refreshToken', cookieOptions);

  return ApiResponse.success(res, null, 'Logged out successfully');
});
