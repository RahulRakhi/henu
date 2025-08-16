# Chatbot Integration Setup Guide

This guide will help you set up the Gemini AI chatbot integration in your React project.

## Prerequisites

1. **Node.js and npm** - Make sure you have Node.js installed on your system
2. **Google AI API Key** - You'll need a Gemini API key from Google

## Installation Steps

### 1. Install Dependencies

First, install the Google AI SDK for Gemini:

```bash
npm install @google/generative-ai
```

### 2. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key

### 3. Set Up Environment Variables

Create a `.env` file in your project root and add your API key:

```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

**Important:** Never commit your `.env` file to version control. Make sure it's in your `.gitignore`.

### 4. Update the Gemini Service

Once you have the API key set up, you'll need to uncomment the actual Gemini API calls in `src/services/geminiService.ts`. Currently, the service uses simulated responses.

Replace the commented code in the `initializeModel()` method:

```typescript
// Replace this:
// const { GoogleGenerativeAI } = await import('@google/generative-ai');
// const genAI = new GoogleGenerativeAI(this.apiKey);
// this.model = genAI.getGenerativeModel({ model: "gemini-pro" });

// With this:
const { GoogleGenerativeAI } = await import('@google/generative-ai');
const genAI = new GoogleGenerativeAI(this.apiKey);
this.model = genAI.getGenerativeModel({ model: "gemini-pro" });
```

And in the `sendMessage()` method, replace the simulation with actual API calls:

```typescript
// Replace the simulation with:
const chat = this.model.startChat({
  history: conversationHistory,
  generationConfig: {
    maxOutputTokens: 1000,
  },
});
const result = await chat.sendMessage(message);
const response = await result.response;
return { text: response.text() };
```

## Features

The chatbot includes the following features:

- **Floating Chat Button** - A beautiful animated button that appears in the bottom-right corner
- **Modern UI** - Clean, responsive design with smooth animations
- **Real-time Messaging** - Instant message sending and receiving
- **Loading States** - Visual feedback while waiting for AI responses
- **Error Handling** - Graceful error handling for API failures
- **Conversation History** - Messages are displayed with timestamps
- **Keyboard Support** - Press Enter to send messages

## Usage

1. Click the chat button in the bottom-right corner
2. Type your message and press Enter or click the send button
3. The AI will respond using Gemini's capabilities
4. Close the chat by clicking the X button or the chat button again

## Customization

You can customize the chatbot by:

- **Styling**: Modify the CSS classes in the components
- **Prompts**: Add system prompts or context in the Gemini service
- **Model**: Change the Gemini model (e.g., gemini-pro-vision for image support)
- **Configuration**: Adjust generation parameters like max tokens, temperature, etc.

## Troubleshooting

### API Key Issues
- Make sure your API key is correctly set in the `.env` file
- Verify the key has the necessary permissions
- Check that the key is not expired

### Network Issues
- Ensure you have a stable internet connection
- Check if your firewall is blocking the requests
- Verify the API endpoints are accessible

### Build Issues
- Make sure all dependencies are installed
- Clear node_modules and reinstall if needed
- Check for TypeScript compilation errors

## Security Notes

- Never expose your API key in client-side code
- Consider implementing rate limiting
- Monitor API usage to avoid unexpected costs
- Use environment variables for all sensitive data

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your API key is working in the Google AI Studio
3. Test with a simple API call first
4. Check the network tab for failed requests

The chatbot is now ready to use! 🚀 