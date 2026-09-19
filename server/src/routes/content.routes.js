import { Router } from 'express';
import {
  getAllContent,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
} from '../controllers/content.controller.js';
import { verifyJWT, authorizeRoles } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createContentSchema,
  updateContentSchema,
  getContentQuerySchema,
} from '../validators/content.validator.js';

const router = Router();

router.route('/')
  .get(validate(getContentQuerySchema), getAllContent)
  .post(verifyJWT, authorizeRoles('admin', 'educator'), validate(createContentSchema), createContent);

router.route('/:id')
  .get(getContentById)
  .put(verifyJWT, authorizeRoles('admin', 'educator'), validate(updateContentSchema), updateContent)
  .delete(verifyJWT, authorizeRoles('admin'), deleteContent);

export default router;
