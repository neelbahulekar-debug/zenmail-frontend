# 🎨 ZenMail Frontend

Beautiful, AI-powered email management interface built with React.

## ✨ Features

- 📧 Smart email categorization (Urgent, Action Required, Spam, etc.)
- 📤 View sent emails
- 🤖 AI-powered reply generation with Gemini
- 📬 Send emails directly from the app
- 🎨 Modern, gradient UI design
- 🔐 Secure Gmail OAuth integration

## 🛠️ Tech Stack

- **React** + **TypeScript**
- **Vite** for fast development
- **Gmail API** integration
- **Google Gemini AI** for smart replies

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔧 Configuration

Update the backend URL in `App.tsx`:

```typescript
const backend = "http://localhost:3000"; // Development
// const backend = "https://your-backend.railway.app"; // Production
```

## 📱 Usage

1. Click "Connect Gmail"
2. Authorize with your Google account
3. Browse emails by category
4. Click "Generate Reply" for AI-powered responses
5. Edit and send replies

## 🎨 Features

### Email Categories
- 🔥 Urgent
- ⚡ Action Required
- ⏳ Waiting
- 🗑️ Spam
- 🏷️ Promotions
- 📰 Newsletters
- 📤 Sent
- 📦 Archived

### AI Reply Generation
- Powered by Gemini 2.5 Flash
- Context-aware responses
- Editable before sending
- Professional tone

## 🚀 Deployment

Deploy to Vercel:
1. Connect this GitHub repo to Vercel
2. Configure build settings:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Deploy automatically

See `DEPLOYMENT.md` for detailed instructions.

## 📝 License

MIT
