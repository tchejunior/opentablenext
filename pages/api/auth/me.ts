import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
// import bcrypt from 'bcrypt';
// import * as jose from 'jose';
import jwt from 'jsonwebtoken';

interface User {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  password?: string;
}
interface Response {
  returnCode: number;
  message: any[];
  user: User;
  errorMessage: string[];
  token: string;
}

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response: Response = {
    returnCode: 0,
    message: [],
    errorMessage: [],
    token: '',
    user: {} as User,
  };

  if (req.method === 'POST') {
    // Get authorization token
    const bearerToken = req.headers.authorization as string;

    // if (!bearerToken) {
    //   // No bearer token provided
    //   response.returnCode = 401;
    //   response.errorMessage.push('Unauthorized request (No bearer token)');
    // } else {
    //   // Check is token is valid
    const token = bearerToken.split(' ')[1];
    //   if (!token) {
    //     // No token provided
    //     response.returnCode = 401;
    //     response.errorMessage.push('Unauthorized request (No token)');
    //   } else {
    //     const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);

    //     try {
    //       // Validate token with jose
    //       await jose.jwtVerify(token, secret);
    //     } catch (error) {
    //       // Invalid token
    //       response.returnCode = 401;
    //       response.errorMessage.push('Unauthorized request (Invalid token)');
    //       response.errorMessage.push(error as string);
    //     }

    if (response.returnCode === 0) {
      // Decode token with jsonwebtoken
      const payload = jwt.decode(token) as { email: string; iat: number; exp: number };

      if (payload.email) {
        // Get user info from DB
        const user = await prisma.n13_User.findUnique({
          where: {
            email: payload.email,
          },
          select: {
            email: true,
            first_name: true,
            last_name: true,
            phone: true,
            city: true,
          },
        });

        if (!user) {
          // No user found
          response.returnCode = 401;
          response.errorMessage.push('Unauthorized request (No user found)');
        } else {
          response.returnCode = 200;
          response.message.push(`User is authenticated`);
          response.user = {
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            phone: user.phone,
            city: user.city,
          };
          response.token = token;
        }
      } else {
        // No email in token
        response.returnCode = 401;
        response.errorMessage.push('Unauthorized request (No email in token)');
      }
    } // response.returnCode !== 401
    //   } // Else token provided
    // } // Else bearer token
  } else {
    // No other HTTP methods allowed
    response.returnCode = 405;
    response.errorMessage.push(`Method Not Allowed`);
  }

  return res.status(response.returnCode).json(response);
}
