// /src/middleware.ts

import jwt from 'jsonwebtoken';

export function Middleware(req: any, res: any, next: any) {
  const authHeader = req.headers['Authorization'];
  // if (!authHeader) {
  //   return res.status(401).json({ msg: 'Invalid Credentials' });
  // }

  try {
    // @ts-ignore
    const tokenVerify = jwt.verify(authHeader, process.env.SECRET); // Split the token from 'Bearer <token>'
    // @ts-ignore
    req.userid = tokenVerify.id;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid or expired token' });
  }
}
