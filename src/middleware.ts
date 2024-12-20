export function Middleware(req: any, res: any, next: any) {
  const authHeader = req.headers['Authorization'];

  if (!authHeader) {
    return res.status(401).json({ msg: 'Authorization header is missing' });
  }

  // Split the token from 'Bearer <token>'
  const token = authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ msg: 'Token is missing in the Authorization header' });
  }

  try {
    // Verify token
    const tokenVerify = jwt.verify(token, process.env.SECRET);  
    req.userid = tokenVerify.id;  // Store the user ID from the decoded token
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid or expired token' });
  }
}
