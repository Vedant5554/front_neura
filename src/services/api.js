import axios from 'axios';

// The backend doesn't exist yet, so we are mocking the Axios API calls
// to prevent the frontend from crashing during development.

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Mock interceptor to catch generation requests and return dummy data 
// instead of throwing network errors while the backend is on hold.
api.interceptors.request.use(config => {
  // If we're making a POST request to generate code
  if (config.url === '/generate' && config.method === 'post') {
    // Throw a specific mock error so we can catch it in App.jsx and use the dummy code
    return Promise.reject({ isMock: true, prompt: config.data.prompt });
  }
  return config;
});

// Mock function: simulates prompt enhancement
export async function enhancePrompt(prompt) {
  await new Promise(resolve => setTimeout(resolve, 800));
  return `Enhanced: ${prompt}`;
}

// Mock function: simulates AI code generation
export async function generateComponentCode(enhancedPrompt) {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return `import React from 'react';\n\nexport default function App() {\n  return (\n    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">\n      <h1 className="text-4xl font-bold text-fuchsia-400 mb-4">Generated Component</h1>\n      <p className="text-slate-300 max-w-md text-center">${enhancedPrompt}</p>\n      <div className="mt-8 p-8 border border-fuchsia-500/30 rounded-2xl bg-slate-800/50">\n        <div className="grid grid-cols-3 gap-2">\n           {[1,2,3,4,5,6,7,8,9].map(i => <div key={i} className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-fuchsia-500/50 cursor-pointer transition-colors border border-slate-600">{i}</div>)}\n        </div>\n      </div>\n    </div>\n  );\n}\n`;
}

export default api;
