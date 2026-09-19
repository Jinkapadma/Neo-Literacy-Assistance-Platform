import { Router } from 'express';
import {
  getAllCurricula,
  getCurriculumById,
  createCurriculum,
  updateCurriculum,
  deleteCurriculum,
} from '../controllers/curriculum.controller.js';
import { verifyJWT, authorizeRoles } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createCurriculumSchema,
  updateCurriculumSchema,
  getCurriculumQuerySchema,
} from '../validators/curriculum.validator.js';

const router = Router();

router.route('/')
  .get(validate(getCurriculumQuerySchema), getAllCurricula)
  .post(verifyJWT, authorizeRoles('admin', 'educator'), validate(createCurriculumSchema), createCurriculum);

router.route('/:id')
  .get(getCurriculumById)
  .put(verifyJWT, authorizeRoles('admin', 'educator'), validate(updateCurriculumSchema), updateCurriculum)
  .delete(verifyJWT, authorizeRoles('admin'), deleteCurriculum);

export default router;
