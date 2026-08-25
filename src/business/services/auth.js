const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const userRepository = require('../../data/repositories/user');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key';

const register = async ({ username, email, password }) => {
  if (!username || !email || !password) {
    const error = new Error('Username, email, and password are required');
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    const error = new Error('Email is already registered');
    error.statusCode = 400;
    throw error;
  }

  // UUIDV4: unique ID
  const customUserId = uuidv4();

  // 2. BCRYPT: encrypt password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // 3. Create user in the database
  const newUser = await userRepository.create({
    userId: customUserId,
    username,
    email,
    password: hashedPassword
  });

  const { password: _, ...userWithoutPassword } = newUser.toObject ? newUser.toObject() : newUser;
  return userWithoutPassword;
};

// LOGIN: bcrypt + jwt
const login = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error('Email and password are required');
    error.statusCode = 400;
    throw error;
  }

  const user = await userRepository.findByEmail(email);
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  //  BCRYPT: Verify password against the hash in the DB
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // JWT: generate the session token by signing with the userId (UUID)
  const token = jwt.sign(
    { userId: user.userId, username: user.username },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password: _, ...userWithoutPassword } = user.toObject ? user.toObject() : user;

  return {
    user: userWithoutPassword,
    token
  };
};

module.exports = {
  register,
  login
};