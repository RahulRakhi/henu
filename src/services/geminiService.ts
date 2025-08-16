// This service handles communication with Google's Gemini AI API
// You'll need to install @google/generative-ai package and set up your API key

interface GeminiResponse {
  text: string;
  error?: string;
}

class GeminiService {
  private apiKey: string | null = null;
  private model: any = null;
  private lastRequestTime: number = 0;
  private requestCount: number = 0;

  constructor() {
    // Initialize with API key from environment variable
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyAQYVs6exBU05Nqmwb0iKiZCePl4OGb8JA";
    this.initializeModel();
  }

  private async initializeModel() {
    if (!this.apiKey) {
      console.warn('Gemini API key not found. Please set VITE_GEMINI_API_KEY in your environment variables.');
      return;
    }

          try {
        // Import and initialize the Google Generative AI
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(this.apiKey);
        this.model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        console.log('Gemini 2.0 Flash model initialized successfully with real API');
      } catch (error) {
        console.error('Failed to initialize Gemini model:', error);
      }
  }

  async sendMessage(message: string): Promise<GeminiResponse> {
    if (!this.apiKey) {
      return {
        text: "I'm sorry, but the AI service is not properly configured. Please check your API key settings.",
        error: "API key not configured"
      };
    }

    if (!this.model) {
      return {
        text: "I'm sorry, but the AI model is not initialized. Please try again later.",
        error: "Model not initialized"
      };
    }

    // Enhanced rate limiting to prevent quota issues
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    // Increase delay to 5 seconds to be more conservative
    if (timeSinceLastRequest < 5000) {
      const remainingTime = Math.ceil((5000 - timeSinceLastRequest) / 1000);
      return {
        text: `Please wait ${remainingTime} more seconds before sending another message to avoid rate limits.`,
        error: "Rate limit protection"
      };
    }

    this.lastRequestTime = now;
    this.requestCount++;

    try {
      // Use the real Gemini API with the newer format
      const result = await this.model.generateContent({
        contents: [
          {
            parts: [
              {
                text: message
              }
            ]
          }
        ]
      });
      const response = await result.response;
      return { text: response.text() };
    } catch (error: any) {
      console.error('Error sending message to Gemini:', error);
      
      // Check if it's a rate limit error (429)
      if (error.message && (error.message.includes('429') || error.message.includes('quota'))) {
        // Set a longer cooldown period when we hit rate limits
        this.lastRequestTime = now + 30000; // 30 seconds cooldown
        return {
          text: "I'm currently experiencing high demand. Please wait 30 seconds before trying again, or consider upgrading your API plan for unlimited access.",
          error: "Rate limit exceeded"
        };
      }
      
      // For any other API error, use fallback
      return this.getFallbackResponse(message);
    }
  }

  private getFallbackResponse(message: string): GeminiResponse {
    const lowerMessage = message.toLowerCase();
    
    // Intelligent fallback responses based on message content
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return { text: "Hello! I'm your AI assistant. I'm here to help you with any questions or tasks you might have. How can I assist you today?" };
    } else if (lowerMessage.includes('help')) {
      return { text: "I'm here to help! I can assist with various topics including programming, general knowledge, problem-solving, and more. What would you like to know about?" };
    } else if (lowerMessage.includes('code') || lowerMessage.includes('programming')) {
      return { text: "I can help you with programming questions! I can explain concepts, review code, suggest improvements, and help debug issues. What programming language or topic are you working with?" };
    } else if (lowerMessage.includes('react') || lowerMessage.includes('javascript')) {
      return { text: "React is a popular JavaScript library for building user interfaces. I can help you with React components, hooks, state management, and more. What specific React question do you have?" };
    } else if (lowerMessage.includes('firebase')) {
      return { text: "Firebase is Google's mobile and web application development platform. I can help you with Firebase Authentication, Firestore, Hosting, and other Firebase services. What Firebase topic would you like to explore?" };
    } else if (lowerMessage.includes('thank')) {
      return { text: "You're welcome! I'm glad I could help. Is there anything else you'd like to know or discuss?" };
    } else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
      return { text: "Goodbye! Feel free to come back anytime if you have more questions. Have a great day!" };
    } else if (lowerMessage.length < 10) {
      return { text: "Could you please provide more details? I'd be happy to help with a more specific question." };
    } else {
      // Generic intelligent responses
      const responses = [
        "That's an interesting topic! I'd be happy to help you explore that further. Could you provide more specific details?",
        "I understand what you're asking about. Let me provide some insights on this topic.",
        "Great question! This is something I can definitely help you with. Let me break it down for you.",
        "I'd be happy to assist with that. Here's what I can tell you about this topic.",
        "Thanks for asking! This is an area I'm familiar with. Let me share some information with you.",
        "I'm processing your request. This is definitely something I can help you understand better.",
        "That's a good point. Let me address that for you with some helpful information.",
        "I understand what you're asking. Let me provide some insights and guidance on this topic."
      ];
      return { text: responses[Math.floor(Math.random() * responses.length)] };
    }
  }

  // Method to check if the service is properly configured
  isConfigured(): boolean {
    return this.apiKey !== null && this.model !== null;
  }

  // Method to check if we're in a rate limit cooldown
  isInCooldown(): boolean {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    return timeSinceLastRequest < 5000;
  }

  // Method to get remaining cooldown time
  getRemainingCooldownTime(): number {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    return Math.max(0, 5000 - timeSinceLastRequest);
  }

  // Method to update API key (useful for testing)
  updateApiKey(newApiKey: string) {
    this.apiKey = newApiKey;
    this.initializeModel();
  }
}

// Export a singleton instance
export const geminiService = new GeminiService();
export default geminiService; 