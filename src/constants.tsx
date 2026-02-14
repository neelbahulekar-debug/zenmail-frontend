
import React from 'react';
import { Category, Email } from './types';

export const CATEGORIES: { id: Category; label: string; icon: React.ReactNode }[] = [
  { 
    id: 'Urgent', 
    label: 'Urgent', 
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> 
  },
  { 
    id: 'Action Required', 
    label: 'Action Required', 
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> 
  },
  { 
    id: 'Waiting on Others', 
    label: 'Waiting', 
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 
  },
  { 
    id: 'Spam', 
    label: 'Spam', 
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> 
  },
  { 
    id: 'Promotions', 
    label: 'Promotions', 
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg> 
  },
  { 
    id: 'Newsletters', 
    label: 'Newsletters', 
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2zM7 8h4m-4 4h8m-8 4h8" /></svg> 
  },
  { 
    id: 'Archived', 
    label: 'Archived', 
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg> 
  },
];

export const MOCK_EMAILS: Email[] = [
  {
    id: '1',
    sender: 'Sarah Jenkins',
    senderEmail: 'sarah.j@techcorp.com',
    subject: 'Project Alpha Deadline Update',
    body: "Hi team, I've updated the project timeline for Alpha. Please review the new milestones by EOD. We're currently ahead of schedule but need to finalize the deployment strategy.",
    timestamp: '10:45 AM',
    category: 'Urgent',
    isRead: false,
    avatar: 'https://picsum.photos/seed/sarah/200'
  },
  {
    id: '2',
    sender: 'Finance Dept',
    senderEmail: 'billing@service.com',
    subject: 'Monthly Subscription Invoice - Jan 2024',
    body: 'Your invoice for the period of January 1st to January 31st is now available for review. The total amount of $199.00 will be charged to your card on file.',
    timestamp: '9:15 AM',
    category: 'Action Required',
    isRead: false,
    avatar: 'https://picsum.photos/seed/finance/200'
  },
  {
    id: '3',
    sender: 'Medium Daily',
    senderEmail: 'noreply@medium.com',
    subject: '10 Productivity Hacks You Need to Know',
    body: 'Today\'s top picks just for you: From deep work techniques to the art of saying no, explore how top performers manage their time.',
    timestamp: 'Yesterday',
    category: 'Newsletters',
    isRead: true,
    avatar: 'https://picsum.photos/seed/medium/200'
  },
  {
    id: '4',
    sender: 'Nike Store',
    senderEmail: 'offers@nike.com',
    subject: 'Exclusive Early Access: Air Max 2024',
    body: 'Get ready for the next generation of comfort. As a member, you get first dibs on the latest Air Max drop before anyone else.',
    timestamp: 'Yesterday',
    category: 'Promotions',
    isRead: true,
    avatar: 'https://picsum.photos/seed/nike/200'
  },
  {
    id: '5',
    sender: 'David Wilson',
    senderEmail: 'david.w@partner.org',
    subject: 'Waiting for Contract Feedback',
    body: 'Hey there, just checking in to see if you had a chance to look at the partnership agreement I sent over last Tuesday. Let me know if you need any adjustments.',
    timestamp: '2 days ago',
    category: 'Waiting on Others',
    isRead: true,
    avatar: 'https://picsum.photos/seed/david/200'
  }
];
