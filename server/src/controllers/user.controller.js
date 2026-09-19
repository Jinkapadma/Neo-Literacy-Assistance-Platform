import { AuthService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await AuthService.getProfile(req.user._id);
  return ApiResponse.success(res, profile, 'Profile fetched successfully');
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await AuthService.updateProfile(req.user._id, req.body);
  return ApiResponse.success(res, updatedUser, 'Profile updated successfully');
});
