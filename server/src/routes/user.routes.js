import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { updateProfileSchema } from '../validators/auth.validator.js';

const router = Router();

router.use(verifyJWT);

router.route('/profile')
  .get(getProfile)
  .put(validate(updateProfileSchema), updateProfile);

export default router;
