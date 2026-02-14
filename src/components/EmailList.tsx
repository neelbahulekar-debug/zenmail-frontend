
import React from 'react';
import { Email, Category } from '../types';

interface EmailListProps {
  category: Category;
  emails: Email[];
  selectedEmailId: string | null;
  onSelectEmail: (id: string) => void;
}

const EmailList: React.FC<EmailListProps> = ({ category, emails, selectedEmailId, onSelectEmail }) => {
  return (
    <div className="w-96 h-full flex flex-col bg-white border-r border-slate-200">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 mb-1">{category}</h2>
        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
          {emails.length} Messages
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {emails.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-slate-500 text-sm">Inbox Zero! <br/>No emails in this category.</p>
          </div>
        ) : (
          emails.map((email) => (
            <div
              key={email.id}
              onClick={() => onSelectEmail(email.id)}
              className={`p-4 border-b border-slate-50 cursor-pointer transition-all duration-200 relative ${
                selectedEmailId === email.id ? 'bg-blue-50/50' : 'hover:bg-slate-50'
              }`}
            >
              {selectedEmailId === email.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />
              )}
              <div className="flex items-start gap-3 mb-1">
                <img 
                  src={email.avatar} 
                  alt={email.sender} 
                  className="w-10 h-10 rounded-full border border-slate-100 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className={`text-sm truncate ${!email.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                      {email.sender}
                    </span>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                      {email.timestamp}
                    </span>
                  </div>
                  <h3 className={`text-xs truncate ${!email.isRead ? 'font-semibold text-slate-800' : 'text-slate-500'}`}>
                    {email.subject}
                  </h3>
                </div>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 pl-13 ml-13">
                {email.body}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmailList;
