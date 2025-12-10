import * as jwt from 'jsonwebtoken';

// generate access token
export function generateAccessToken(payload: object): string {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}  

// verify token 
export function verifyToken(token: string): object {
  return jwt.verify(token, process.env.JWT_SECRET);
}

// generate refresh token
export function generateRefreshToken(payload: object): string {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
}
