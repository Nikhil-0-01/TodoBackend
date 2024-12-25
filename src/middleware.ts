
import jwt from "jsonwebtoken";

export function Middleware(req: any, res: any, next: any) {
  // Ensure you're accessing the authorization header with the correct case
  const authHeader = req.headers['authorization'];  // 'authorization' is all lowercase

  if (!authHeader) {
    return res.status(401).json({ msg: 'Authorization header is missing' });
  }

  try {
<<<<<<< HEAD
=======
    console.log('Secret:', process.env.SECRET);

>>>>>>> 5da0dd817972df19f44f9ffa9a69e4cd8a1131ad

    // @ts-ignore 
    const tokenVerify = jwt.verify(authHeader, process.env.SECRET);
    req.userid = (tokenVerify as any).id;
<<<<<<< HEAD
=======

>>>>>>> 5da0dd817972df19f44f9ffa9a69e4cd8a1131ad
    next();
    
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid or expired token' });
  }
}
