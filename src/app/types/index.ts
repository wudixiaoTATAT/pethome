export interface Pet {
  id: string;
  name: string;
  type: 'cat' | 'dog' | 'other';
  breed: string;
  description: string;
  imageUrl: string;
  location: string;
  school: string;
  friendliness: number;
  likes: number;
}

export interface Comment {
  id: string;
  petId: string;
  userName: string;
  content: string;
  timestamp: Date;
}

export interface Post {
  id: string;
  petId: string;
  userName: string;
  content: string;
  timestamp: Date;
}

export interface School {
  id: string;
  name: string;
  description: string;
  address: string;
  logoUrl?: string;
  websiteUrl?: string;
  petCount: number;
}

export interface PetSubmission {
  id: string;
  name: string;
  type: 'cat' | 'dog' | 'other';
  breed: string;
  description: string;
  imageUrl: string;
  location: string;
  school: string;
  submitterName: string;
  submitterContact: string;
  timestamp: Date;
  status: 'pending' | 'approved' | 'rejected';
}

export interface SchoolSubmission {
  id: string;
  name: string;
  description: string;
  address: string;
  logoUrl?: string;
  websiteUrl?: string;
  submitterName: string;
  submitterContact: string;
  timestamp: Date;
  status: 'pending' | 'approved' | 'rejected';
}
