export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  age?: number;
  county?: string;
  bio?: string;
  occupation?: string;
  education?: string;
  interests?: string[];
  isActivated: boolean;
  onboardingCompleted: boolean;
  photos: string[];
  isVerified: boolean;
  coins: number;
  referralCode: string;
  referredBy?: string;
  createdAt: Date;
  lastSeen: Date;
  onlineStatus: 'online' | 'offline' | 'away';
}

export interface Match {
  id: string;
  users: string[]; // [uid1, uid2]
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  type: 'text' | 'image' | 'voice';
  createdAt: Date;
  read: boolean;
}

export interface Like {
  fromId: string;
  toId: string;
  createdAt: Date;
}

export interface Referral {
  referrerId: string;
  referredUserId: string;
  status: 'pending' | 'completed';
  createdAt: Date;
}
