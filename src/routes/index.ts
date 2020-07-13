import {Router} from 'express';
import UserRouter from './userRoute';
import PhotoRouter from './photoRoute';
import AuthRouter from './authenRoute';
import Friend from './friendRoute';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/auth', AuthRouter);
router.use('/users', UserRouter);
router.use('/photo', PhotoRouter);
router.use('/friend', Friend);

// Export the base-router
export default router;
