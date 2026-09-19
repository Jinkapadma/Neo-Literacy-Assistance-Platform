import { Curriculum } from '../models/Curriculum.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

export const getAllCurricula = asyncHandler(async (req, res) => {
  const { language, targetLevel, category, search, page = 1, limit = 10 } = req.query;

  const filter = { isPublished: true };
  if (language) filter.language = language;
  if (targetLevel) filter.targetLevel = targetLevel;
  if (category) filter.category = category;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [curricula, total] = await Promise.all([
    Curriculum.find(filter)
      .sort({ sequence: 1, createdAt: 1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('createdBy', 'name email'),
    Curriculum.countDocuments(filter),
  ]);

  return ApiResponse.success(
    res,
    {
      curricula,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    },
    'Curricula fetched successfully'
  );
});

export const getCurriculumById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const curriculum = await Curriculum.findById(id)
    .populate('createdBy', 'name email')
    .populate({
      path: 'modules.lessons.contentRef',
      select: 'title language difficultyLevel contentType summary audioUrl imageUrl vocabulary',
    });

  if (!curriculum) {
    throw ApiError.notFound('Curriculum not found');
  }

  return ApiResponse.success(res, curriculum, 'Curriculum details fetched successfully');
});

export const createCurriculum = asyncHandler(async (req, res) => {
  const newCurriculum = await Curriculum.create({
    ...req.body,
    createdBy: req.user?._id,
  });

  return ApiResponse.created(res, newCurriculum, 'Curriculum created successfully');
});

export const updateCurriculum = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedCurriculum = await Curriculum.findByIdAndUpdate(id, { $set: req.body }, { new: true, runValidators: true });

  if (!updatedCurriculum) {
    throw ApiError.notFound('Curriculum not found');
  }

  return ApiResponse.success(res, updatedCurriculum, 'Curriculum updated successfully');
});

export const deleteCurriculum = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedCurriculum = await Curriculum.findByIdAndDelete(id);

  if (!deletedCurriculum) {
    throw ApiError.notFound('Curriculum not found');
  }

  return ApiResponse.success(res, null, 'Curriculum deleted successfully');
});
