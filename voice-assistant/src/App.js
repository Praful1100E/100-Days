import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Check for browser support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      recognitionInstance.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        setTranscript(speechResult);
        processCommand(speechResult);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setResponse('Sorry, I couldn\'t understand that. Please try again.');
        speak('Sorry, I couldn\'t understand that. Please try again.');
      };

      setRecognition(recognitionInstance);
    } else {
      setResponse('Speech recognition is not supported in this browser.');
    }
  }, []);

  const startListening = () => {
    if (recognition && !isListening) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  const processCommand = (command) => {
    const lowerCommand = command.toLowerCase();
    let reply = '';

    if (lowerCommand.includes('hello') || lowerCommand.includes('hi')) {
      reply = 'Hello! How can I help you today?';
    } else if (lowerCommand.includes('how are you')) {
      reply = 'I\'m doing well, thank you for asking!';
    } else if (lowerCommand.includes('what is your name') || lowerCommand.includes('who are you')) {
      reply = 'I am your voice assistant prototype.';
    } else if (lowerCommand.includes('time')) {
      reply = `The current time is ${new Date().toLocaleTimeString()}.`;
    } else if (lowerCommand.includes('date')) {
      reply = `Today's date is ${new Date().toLocaleDateString()}.`;
    } else {
      reply = 'I\'m sorry, I didn\'t understand that command. Try saying "hello" or "what time is it?".';
    }

    setResponse(reply);
    speak(reply);
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Voice Assistant</h1>
        <div className="mic-container">
          <button
            className={`mic-button ${isListening ? 'listening' : ''}`}
            onClick={isListening ? stopListening : startListening}
          >
            🎤
          </button>
          <p className="status">{isListening ? 'Listening...' : 'Click to speak'}</p>
        </div>
        <div className="transcript">
          <h3>You said:</h3>
          <p>{transcript || '...'}</p>
        </div>
        <div className="response">
          <h3>Response:</h3>
          <p>{response || 'Waiting for your command...'}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
