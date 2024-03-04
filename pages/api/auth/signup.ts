import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import * as jose from 'jose';

import validator from 'validator';

interface Response {
  returnCode: number;
  message: string[];
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
        const hashedPassword = await bcrypt.hash(password, 10);

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

        const alg = 'HS256';

        const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);

        response.token = await new jose.SignJWT({
          email,
        })
          .setProtectedHeader({ alg })
          .setIssuedAt()
          .setIssuer('OpenTable')
          .setExpirationTime('24h')
          .sign(secret);

        response.returnCode = 200;
        response.message.push(`User created successfully!`);
      }
    }
  } else {
    // Handle any other HTTP method
    response.returnCode = 405;
    response.errorMessage.push(`Method Not Allowed`);
  }

  return res.status(response.returnCode).json(response);
}
