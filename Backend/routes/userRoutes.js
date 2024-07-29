// userRoutes.js
import express from 'express';
import { 
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getPerfumeRecommendationsHandler,
    addToFavourites,
    getFavourites,
    removePerfumeFromFavorites
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();


router.post('/auth', authUser);
router.post('/', registerUser);
router.post('/logout', logoutUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.post('/add-favourites', protect, addToFavourites);
router.post('/recommend-perfumes', getPerfumeRecommendationsHandler);
router.get('/favourites', protect, getFavourites);
router.delete('/favourites/remove', protect, removePerfumeFromFavorites);

export default router;
