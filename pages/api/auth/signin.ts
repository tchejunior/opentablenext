import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import * as jose from 'jose';

import validator from 'validator';
import { setCookie } from 'cookies-next';

interface Response {
  returnCode: number;
  message: any[];
  errorMessage: string[];
  token: string;
}

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response: Response = { returnCode: 0, message: [], errorMessage: [], token: '' };

  if (req.method === 'POST') {
    // Des-structure the request body
    const { email, password } = req.body;

    const errors: string[] = [];

    const validationSchema = [
      {
        valid: validator.isEmail(email),
        errorMessage: 'Email is invalid',
      },
      {
        valid: validator.isLength(password, { min: 1 }),
        errorMessage: 'Password is invalid',
      },
    ];

    // Validate email and password
    validationSchema.forEach((schema) => {
      if (!schema.valid) {
        errors.push(schema.errorMessage);
      }
    });

    if (errors.length) {
      // There are errors
      response.returnCode = 400;
      response.errorMessage = errors;
    } else {
      // No errors, proceed to check if the user exists
      // Check if the user exists
      const userWithEmail = await prisma.n13_User.findUnique({
        where: {
          email,
        },
      });

      if (userWithEmail) {
        // The user exists, check the password
        const isMatch = await bcrypt.compare(password, userWithEmail.password);
        userWithEmail.password = 'hidden for security reasons';

        if (isMatch) {
          // Password check passed, create a JWT
          // Define algorithm for the JWT
          const alg = 'HS256';

          // Get the secret for the JWT from the environment variable
          const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);

          // Create the JWT with the email only
          response.token = await new jose.SignJWT({
            email,
          })
            .setProtectedHeader({ alg })
            .setIssuedAt()
            .setIssuer('OpenTable')
            .setExpirationTime('24h')
            .sign(secret);

          setCookie('jwt417', response.token, {
            req,
            res,
            // maxAge: 60 * 60 * 24, // 24 hours - 86400 seconds
            maxAge: 60 * 60 * 24 * 20, // 30 days - 2592000 seconds
            // Copilot auto filled the following options
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
          });

          response.returnCode = 200;
          response.message.push(`User logged in successfully!`);
          response.message.push({
            firstName: userWithEmail.first_name,
            lastName: userWithEmail.last_name,
            email: userWithEmail.email,
            phone: userWithEmail.phone,
            city: userWithEmail.city,
          });
        } else {
          // The password is invalid
          response.returnCode = 401;
          response.errorMessage.push(`Email or password is invalid!`);
        }
      } else {
        // The user does not exist
        response.returnCode = 401;
        response.errorMessage.push(`Email or password is invalid!`);
      }
    }
  } else {
    // No other HTTP methods allowed
    response.returnCode = 405;
    response.errorMessage.push(`Method Not Allowed`);
  }

  return res.status(response.returnCode).json(response);
}
