import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Favourites from '../models/favouritesModel.js';
import generateToken from '../utils/generateToken.js';
import axios from 'axios';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

// Auth user/set token
// route POST /api/users/auth
// access Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && await user.matchPassword(password)) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile
        });
    } else {
        res.status(401);
        throw new Error('Invalid Email or Password');
    }
});

// Register a new user
// route POST /api/users/
// access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, mobile, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        mobile,
        password
    });

    if (user) {
        generateToken(res, user._id)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// Logout user
// route POST /api/users/logout
// access Public
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })
    res.status(200).json({ message: 'User logged out' });
});

// Get user profile
// route GET /api/users/profile
// access Private
const getUserProfile = asyncHandler(async (req, res) => {

    res.status(200).json({ message: "AuraSense user profile" });
});

// Update user profile
// route PUT /api/users/auth
// access Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.mobile = req.body.mobile || user.mobile;
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            mobile: updatedUser.mobile
        })
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

//Open AI Recommendation
// Get perfume recommendations
// route POST /api/users/recommend-perfumes
// access Public
const getPerfumeRecommendationsHandler = asyncHandler(async (req, res) => {
    const { description } = req.body;

    try {
        const recommendations = await getPerfumeRecommendations(description);
        res.status(200).json({ recommendations });
    } catch (error) {
        console.error('Error fetching perfume recommendations:', error);
        res.status(500).send('Error fetching perfume recommendations');
    }
});

// Get perfume recommendations function

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY
// });

// const getPerfumeRecommendations = async (description) => {
//     const completion = await openai.chat.completions.create({
//         messages: [{ role: "system", content: `Based on the following description, recommend some perfumes: ${description}` }],
//         model: "gpt-3.5-turbo",
//       });

//       console.log(completion.choices[0]);



//     const response = await axios.post('https://api.openai.com/v1/engines/gpt-4/completions', {
//         prompt: `Based on the following description, recommend some perfumes: ${description}`,
//         max_tokens: 150,
//         temperature: 0.7,
//     }, {
//         headers: {
//             'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//             'Content-Type': 'application/json'
//         }
//     });

//     return response.data.choices[0].text.trim();
// };

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const getPerfumeRecommendations = async (description) => {
    const prompt = `Based on the following description, recommend some perfumes, I only need the name, notes,description and price( in indian) of the perfumes: ${description}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("text" , text)
    return text;

};

// Add to favourites
// route POST /api/users/add-favourites
// access Private
const addToFavourites = asyncHandler(async (req, res) => {
    let { perfumeName } = req.body;
    perfumeName = perfumeName.replace(/^[^\w\d]*([\w\d].*[\w\d])?[^\w\d]*$/, '$1').trim();

    const userId = req.user._id;

    let favourites = await Favourites.findOne({ userId });

    if (favourites) {
        if (!favourites.perfumeNames.includes(perfumeName)) {
            favourites.perfumeNames.push(perfumeName);
            await favourites.save();
            res.status(201).json({ message: `${perfumeName} added to favourites` });
        } else {
            res.status(400).json({ message: `${perfumeName} already in favourites` });
        }
    } else {
        favourites = new Favourites({
            userId,
            perfumeNames: [perfumeName],
        });
        await favourites.save();
        res.status(201).json({ message: 'Perfume added to favourites' });
    }
});

const getFavourites = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const favourites = await Favourites.findOne({ userId });

    if (favourites) {
        res.status(200).json(favourites.perfumeNames);
    } else {
        res.status(404).json({ message: 'No favourites found' });
    }
});

const removePerfumeFromFavorites = asyncHandler(async (req, res) => {
    const perfumeName = req.body.perfumeName;
    const userId = req.user._id;

    let favourites = await Favourites.findOne({ userId });

    if (!favourites) {
        return res.status(404).json({ message: "Favourites not found" });
    }

    if (!favourites.perfumeNames.includes(perfumeName)) {
        return res.status(400).json({ message: `${perfumeName} is not in favourites` });
    }

    favourites.perfumeNames = favourites.perfumeNames.filter(name => name !== perfumeName);

    await favourites.save();

    res.status(200).json({ message: `${perfumeName} removed from favorites` });
});


export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getPerfumeRecommendationsHandler,
    addToFavourites,
    getFavourites,
    removePerfumeFromFavorites
};