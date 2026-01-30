export interface Animal {
  id: string;
  name: string;
  location: string;
  personality: string;
  image_url: string;
  type: 'cat' | 'dog' | 'other';
  breed?: string;
  school: string;
  likes: number;
  attacks: number; // 被攻击次数
  created_at: string;
}

export interface Comment {
  id: string;
  animal_id: string;
  user_name: string;
  content: string;
  created_at: string;
}

export interface Submission {
  id: string;
  animal_data: Partial<Animal>;
  status: 'pending' | 'approved' | 'rejected';
  submitter_name: string;
  submitter_contact: string;
  created_at: string;
}