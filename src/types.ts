
export type Category = 
  | 'Urgent' 
  | 'Action Required' 
  | 'Waiting on Others' 
  | 'Spam' 
  | 'Promotions' 
  | 'Newsletters' 
  | 'Archived';

export interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  body: string;
  timestamp: string;
  category: Category;
  isRead: boolean;
  avatar: string;
}

export interface AccountConnection {
  provider: 'Gmail' | 'Yahoo';
  email: string;
  isConnected: boolean;
}
