
export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  DELETED = "DELETED",
}

export interface User {
  id: string;
  firstName: string; // Added from schema
  lastName: string;  // Added from schema
  email: string;
  username: string;
  password: string; // Usually excluded from DTOs/interfaces unless needed for creation
  fullName?: string | null; // Made nullable
  avatarUrl?: string | null; // Made nullable
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  // Security
  permitId: string;
  permits: Permit; // Corrected to single object based on relation

  profile?: File | null;

  referredById: string;
  referredBy: User;
  referralCode: string;
  referrals: User[];
}

export interface Permit {
    id: string;
    name: string;
    description?: string; // Made optional to match schema
    list: string[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;

    // Relations
    users?: User[]; // Added relation
}
