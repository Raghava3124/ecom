import jwt from 'jsonwebtoken';
import { User } from '../models/index.js'; // Ensure this imports User model correctly

export default async (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.header('Authorization')?.split(' ')[1];

  // Log the token for debugging purposes
  // console.log("Token:", token);
  console.log("Token:", token);
  console.log("Secret used:", process.env.JWT_SECRET);


  // If no token is found in the request
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    // Verify the token using the secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user based on the decoded token's user id
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    // Attach the user object to the request so the route can use it
    req.user = user;
    next(); // Pass control to the next middleware or route handler
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
