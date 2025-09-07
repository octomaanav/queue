export interface Session {
  id: string;
  user_id: string;
  oh_id: string;
  created_at: Date;
  expires_at: Date;
  is_valid: boolean;
} 