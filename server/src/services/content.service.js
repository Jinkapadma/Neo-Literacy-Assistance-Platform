import { Content } from '../models/Content.model.js';
import { ApiError } from '../utils/apiError.js';

export class ContentService {
  static async queryContent({ language, difficultyLevel, contentType, search, tag, page = 1, limit = 12 }) {
    const filter = { isPublished: true };

    if (language) {
      filter.language = language;
    }
    if (difficultyLevel) {
      filter.difficultyLevel = difficultyLevel;
    }
    if (contentType) {
      filter.contentType = contentType;
    }
    if (tag) {
      filter.tags = tag;
    }
    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Content.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'name email'),
      Content.countDocuments(filter),
    ]);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getContentById(contentId, targetLanguage = null) {
    const content = await Content.findById(contentId).populate('createdBy', 'name email');
    if (!content) {
      throw ApiError.notFound('Learning content not found');
    }

    // If a specific language translation is requested and available, return enriched payload
    if (targetLanguage && targetLanguage !== content.language) {
      const translation = content.translations.find(t => t.language === targetLanguage);
      return {
        ...content.toObject(),
        activeTranslation: translation || null,
      };
    }

    return content;
  }

  static async createContent(contentData, userId) {
    const newContent = await Content.create({
      ...contentData,
      createdBy: userId,
    });
    return newContent;
  }

  static async updateContent(contentId, updateData) {
    const content = await Content.findByIdAndUpdate(contentId, { $set: updateData }, { new: true, runValidators: true });
    if (!content) {
      throw ApiError.notFound('Content not found');
    }
    return content;
  }

  static async deleteContent(contentId) {
    const content = await Content.findByIdAndDelete(contentId);
    if (!content) {
      throw ApiError.notFound('Content not found');
    }
    return content;
  }
}
