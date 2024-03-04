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
    const { firstName, lastName, email, phone, city, password } = req.body;

    // Check if the email is already associated with an account
    const userWithEmail = await prisma.n13_User.findUnique({
      where: {
        email,
      },
    });

    if (userWithEmail) {
      // There is a user with the email
      response.returnCode = 400;
      response.errorMessage.push(`Email ${email} is already associated with an account!`);
    } else {
      // There is no user with the email, check field validation
      const errors: string[] = [];

      const validationSchema = [
        {
          valid: validator.isLength(firstName, { min: 1, max: 25 }),
          errorMessage: 'First name must be between 1 and 25 characters',
        },
        {
          valid: validator.isLength(lastName, { min: 1, max: 25 }),
          errorMessage: 'Last name must be between 1 and 25 characters',
        },
        {
          valid: validator.isEmail(email),
          errorMessage: 'Email is invalid',
        },
        {
          valid: validator.isMobilePhone(phone),
          errorMessage: 'Phone is invalid',
        },
        {
          valid: validator.isLength(city, { min: 1, max: 25 }),
          errorMessage: 'City is invalid',
        },
        {
          valid: validator.isStrongPassword(password),
          errorMessage: 'Password is not strong enough',
        },
      ];

      // Validate the fields
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
        // No errors, create the user
        // Create bcrypt hashed password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user in the DB
        await prisma.n13_User.create({
          data: {
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            city,
            password: hashedPassword,
          },
        });

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

        response.returnCode = 201;
        response.message.push(`User created successfully!`);
        response.message.push({
          firstName,
          lastName,
          email,
          phone,
          city,
        });
      }
    }
  } else {
    // No other HTTP methods allowed
    response.returnCode = 405;
    response.errorMessage.push(`Method Not Allowed`);
  }

  return res.status(response.returnCode).json(response);
}
