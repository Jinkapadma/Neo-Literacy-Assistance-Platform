import { ContentService } from '../services/content.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

export const getAllContent = asyncHandler(async (req, res) => {
  const { language, difficultyLevel, contentType, search, tag, page, limit } = req.query;

  const result = await ContentService.queryContent({
    language,
    difficultyLevel,
    contentType,
    search,
    tag,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 12,
  });

  return ApiResponse.success(res, result, 'Content repository fetched successfully');
});

export const getContentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { lang } = req.query;

  const content = await ContentService.getContentById(id, lang);
  return ApiResponse.success(res, content, 'Content details fetched successfully');
});

export const createContent = asyncHandler(async (req, res) => {
  const newContent = await ContentService.createContent(req.body, req.user?._id);
  return ApiResponse.created(res, newContent, 'Content created successfully');
});

export const updateContent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedContent = await ContentService.updateContent(id, req.body);
  return ApiResponse.success(res, updatedContent, 'Content updated successfully');
});

export const deleteContent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await ContentService.deleteContent(id);
  return ApiResponse.success(res, null, 'Content deleted successfully');
});
