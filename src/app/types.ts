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
  imageUrl?: string;
  timestamp: Date;
}