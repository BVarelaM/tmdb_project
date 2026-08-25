const userRepository = require('../../data/repositories/user');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { movieItem } = require('../models/Movie');

const JWT_SECRET = process.env.JWT_SECRET;
const VALID_LISTS = ['watchlist', 'favorites', 'watched'];

//REGISTER
const registerUser = async (userData) => {
  const { username, email, password } = userData;

  if (!username || !email || !password) {
    const error = new Error('Username, email, and password are required');
    error.statusCode = 400;
    throw error;
  }

  // generate a unique user ID using UUIDv4
  const userId = uuidv4();

  // encrypt the password using bcrypt
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // create the user in the database
  const newUser = await userRepository.create({
    userId,
    username,
    email,
    password: hashedPassword
  });

  // return the user object without the password
  const userObj = newUser.toObject ? newUser.toObject() : newUser;
  const { password: _, ...userWithoutPassword } = userObj;
  
  return userWithoutPassword;
};

const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error('Email and password are required.');
    error.statusCode = 400;
    throw error;
  }

  // 1. Search user by emaim
  const user = await userRepository.findByEmail(email);
  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  // 2. compare pass with hash and brypt
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  // signed jwt with userid (UUID)
  const token = jwt.sign(
    { userId: user.userId, username: user.username },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  return {
    token,
    user: {
      userId: user.userId,
      username: user.username,
      email: user.email
    }
  };
};


const getUserProfile = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const { password, ...userProfile } = user;
  return userProfile;
};

const getAllUsers = async () => {
  const users = await userRepository.findAll();
  
  return users.map(user => {
    const userObj = user.toObject ? user.toObject() : user;
    const { password, ...userWithoutPassword } = userObj;
    return userWithoutPassword;
  });
};

const addMovieToList = async (userId, listName, movieData) => {
    
  if (!VALID_LISTS.includes(listName)) {
    const error = new Error(`List '${listName}' is not valid. Allowed lists: ${VALID_LISTS.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  const movieItemVar = movieItem(movieData);

  const user = await userRepository.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const added = await userRepository.addMovieToList(userId, listName, movieItemVar);
  if (!added) {
    const error = new Error(`The movie is already in your ${listName} list`);
    error.statusCode = 400;
    throw error;
  }

  return { message: `Movie added successfully to ${listName}`, movie: movieItemVar };
};

const removeMovieFromList = async (userId, listName, tmdbId) => {
  if (!VALID_LISTS.includes(listName)) {
    const error = new Error(`List '${listName}' is not valid. Allowed lists: ${VALID_LISTS.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  if (!tmdbId) {
    const error = new Error('The tmdbId of the movie is required');
    error.statusCode = 400;
    throw error;
  }

  const removed = await userRepository.removeMovieFromList(userId, listName, tmdbId);
  if (!removed) {
    const error = new Error(`The movie is not in your ${listName} list`);
    error.statusCode = 404;
    throw error;
  }

  return { message: `Movie removed from ${listName}` };
};

const compareUserLists = async (currentUserId, targetUserId, listName = 'watchlist') => {
  if (currentUserId === targetUserId) {
    const error = new Error('You cannot compare your list with your own');
    error.statusCode = 400;
    throw error;
  }

  const userA = await userRepository.findById(currentUserId);
  const userB = await userRepository.findById(targetUserId);

  if (!userA || !userB) {
    const error = new Error('One or both users do not exist');
    error.statusCode = 404;
    throw error;
  }

  const listA = userA[listName] || [];
  const listB = userB[listName] || [];

  const idsA = listA.map((movie) => movie.tmdbId);
  const idsB = new Set(listB.map((movie) => movie.tmdbId));

  const commonIds = idsA.filter((id) => idsB.has(id));

  const commonMovies = listA.filter((movie) => commonIds.includes(movie.tmdbId));

  return {
    comparedWith: userB.username,
    listName,
    totalCommon: commonMovies.length,
    commonMovies
  };
};

module.exports = {
  getUserProfile,
  registerUser,
  loginUser,
  getAllUsers,
  addMovieToList,
  removeMovieFromList,
  compareUserLists
};