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

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentication
 */

/**
 * @swagger
 * /api/users/auth:
 *   post:
 *     summary: Authenticate a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid email or password
 */
router.post('/auth', authUser);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid user data
 */
router.post('/', registerUser);

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.post('/logout', logoutUser);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       400:
 *         description: Invalid user data
 *       401:
 *         description: Unauthorized
 */
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

/**
 * @swagger
 * /api/users/add-favourites:
 *   post:
 *     summary: Add perfume to favourites
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               perfumeId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfume added to favourites
 *       401:
 *         description: Unauthorized
 */
router.post('/add-favourites', protect, addToFavourites);

/**
 * @swagger
 * /api/users/recommend-perfumes:
 *   post:
 *     summary: Get perfume recommendations
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfume recommendations retrieved successfully
 */
router.post('/recommend-perfumes', getPerfumeRecommendationsHandler);

/**
 * @swagger
 * /api/users/favourites:
 *   get:
 *     summary: Get favourite perfumes
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Favourite perfumes retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/favourites', protect, getFavourites);

/**
 * @swagger
 * /api/users/favourites/remove:
 *   delete:
 *     summary: Remove perfume from favourites
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               perfumeId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfume removed from favourites
 *       401:
 *         description: Unauthorized
 */
router.delete('/favourites/remove', protect, removePerfumeFromFavorites);

export default router;
