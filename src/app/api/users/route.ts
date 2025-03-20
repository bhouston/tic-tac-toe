import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();
    
    // Validate inputs
    if (!name || !email) {
      return NextResponse.json(
        { message: 'Name and email are required' },
        { status: 400 }
      );
    }
    
    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      // Update existing user's name
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { name },
      });
      
      return NextResponse.json(updatedUser);
    } else {
      // Create new user
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
        },
      });
      
      return NextResponse.json(newUser);
    }
  } catch (error) {
    console.error('Error in user registration:', error);
    return NextResponse.json(
      { message: 'Failed to process registration' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}