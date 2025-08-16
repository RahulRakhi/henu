import React, { useState } from 'react';
import geminiService from '../services/geminiService';

const GeminiTest: React.FC = () => {
  const [status, setStatus] = useState('Testing Gemini API...');
  const [testMessage, setTestMessage] = useState('Hello, how are you?');

  const testGeminiAPI = async () => {
    // Check if we're in cooldown
    if (geminiService.isInCooldown()) {
      const remainingTime = Math.ceil(geminiService.getRemainingCooldownTime() / 1000);
      setStatus(`⏳ Rate limit protection: Please wait ${remainingTime} more seconds`);
      return;
    }

    setStatus('Sending test message to Gemini...');
    try {
      const response = await geminiService.sendMessage(testMessage);
      if (response.error) {
        if (response.error.includes('Rate limit')) {
          setStatus(`⚠️ ${response.text}`);
        } else {
          setStatus(`❌ Gemini API Error: ${response.error}`);
        }
      } else {
        setStatus(`✅ Gemini API Working! Response: ${response.text.substring(0, 50)}...`);
      }
    } catch (error) {
      setStatus(`❌ Gemini API Error: ${error}`);
    }
  };

  const isInCooldown = geminiService.isInCooldown();
  const remainingTime = Math.ceil(geminiService.getRemainingCooldownTime() / 1000);

  return (
    <div className="fixed top-32 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 max-w-sm">
      <div className="text-sm font-medium mb-2">Gemini 2.0 Flash API Test</div>
      <div className="text-xs mb-2">{status}</div>
      {isInCooldown && (
        <div className="text-xs mb-2 text-yellow-300">
          ⏳ Cooldown: {remainingTime}s remaining
        </div>
      )}
      <input
        type="text"
        value={testMessage}
        onChange={(e) => setTestMessage(e.target.value)}
        className="w-full px-2 py-1 text-black text-xs rounded mb-2"
        placeholder="Test message"
      />
      <button
        onClick={testGeminiAPI}
        disabled={isInCooldown}
        className={`px-2 py-1 rounded text-xs ${
          isInCooldown 
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
            : 'bg-white text-blue-500 hover:bg-gray-100'
        }`}
      >
        {isInCooldown ? `Wait ${remainingTime}s` : 'Test Gemini'}
      </button>
    </div>
  );
};

export default GeminiTest; 