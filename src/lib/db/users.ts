import { prisma } from '../prisma';
import { User } from '@prisma/client';

/**
 * Create a new user
 */
export async function createUser(name: string, email: string): Promise<User> {
  return prisma.user.create({
    data: {
      name,
      email,
    },
  });
}

/**
 * Get a user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

/**
 * Get all users
 */
export async function getAllUsers(): Promise<User[]> {
  return prisma.user.findMany();
}