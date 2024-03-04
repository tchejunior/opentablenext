// import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
// import bcrypt from 'bcrypt';
import * as jose from 'jose';
// import jwt from 'jsonwebtoken';

interface Response {
  returnCode: number;
  message: any[];
  errorMessage: string[];
  token: string;
}

// const prisma = new PrismaClient();

export async function middleware(req: NextRequest, res: NextResponse) {
  const response: Response = { returnCode: 0, message: [], errorMessage: [], token: '' };

  // Get authorization token
  const bearerToken = req.headers.get('authorization') as string;

  if (!bearerToken) {
    // No bearer token provided
    response.returnCode = 401;
    response.errorMessage.push('Unauthorized request (No bearer token)');
  } else {
    // Check is token is valid
    const token = bearerToken.split(' ')[1];
    if (!token) {
      // No token provided
      response.returnCode = 401;
      response.errorMessage.push('Unauthorized request (No token)');
    } else {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);

      try {
        // Validate token with jose
        await jose.jwtVerify(token, secret);
      } catch (error) {
        // Invalid token
        response.returnCode = 401;
        response.errorMessage.push('Unauthorized request (Invalid token)');
        response.errorMessage.push(error as string);
      }
    }
  }
  if (response.returnCode !== 0) {
    return new NextResponse(JSON.stringify(response), {
      status: response.returnCode,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const config = {
  matcher: ['/api/auth/me'],
};
