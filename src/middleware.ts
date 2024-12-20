import jwt from 'jsonwebtoken';

export function Middleware(req: any, res: any, next: any) {
  // Get the Authorization header
  const authHeader = req.headers['Authorization'];

  if (!authHeader) {
    return res.status(401).json({ msg: 'Authorization header is missing' });
  }

  // Extract the token from the 'Bearer <token>' format
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'Token is missing in the Authorization header' });
  }

  try {
    // Verify the token using the secret key from the environment variable
    const tokenVerify = jwt.verify(token, process.env.SECRET);
    
    // Attach the userId to the request object for use in subsequent routes
    req.userid = tokenVerify.id;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid or expired token' });
  }
}
