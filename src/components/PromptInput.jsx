import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Send } from 'lucide-react';
import { useStore } from '../store';
import { enhancePrompt, generateComponentCode } from '../services/api';
import { useWebContainer } from '../hooks/useWebContainer';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function PromptInput() {
  const [inputValue, setInputValue] = useState('');
  const { setPrompt, setLoadingStep, setGeneratedCode, addHistory, loadingStep, setActiveTab } = useStore();
  const { bootAndMount } = useWebContainer();
  const textareaRef = useRef(null);

  const isGenerating = loadingStep !== 'idle' && loadingStep !== 'ready';

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isGenerating) return;
    
    const userMessage = inputValue;
    setInputValue('');
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
    }

    setPrompt(userMessage);
    addHistory({ type: 'user', content: userMessage, timestamp: Date.now() });
    
    try {
      setLoadingStep('enhancing');
      const enhanced = await enhancePrompt(userMessage);
      
      setLoadingStep('generating');
      const code = await generateComponentCode(enhanced);
      setGeneratedCode(code);
      
      await bootAndMount(code);
      addHistory({ type: 'ai', content: "I've generated the UI component for you. You can preview it on the right or view the source code.", timestamp: Date.now() });
      setActiveTab('preview');
      toast.success('Component generated successfully!');
    } catch (err) {
      toast.error('Generation failed.');
      setLoadingStep('idle');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleGenerate();
    }
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  };

  return (
    <div className="p-4 bg-[#0A0A0A] border-t border-[#1F1F22] flex-shrink-0">
        <motion.form 
            layoutId="chatbot-input"
            onSubmit={handleGenerate} 
            className="relative bg-[#111111] border border-[#1F1F22] rounded-2xl p-2 shadow-lg focus-within:border-brand-pink/50 focus-within:bg-[#151515] transition-colors flex flex-col"
        >
            <textarea 
                ref={textareaRef}
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Describe the UI you want to build..."
                className="w-full bg-transparent border-none outline-none resize-none text-sm p-2 text-gray-200 placeholder-gray-600 max-h-[200px] min-h-[44px]"
                rows="1"
            />
            <div className="flex items-center justify-between mt-2 px-2 pb-1">
                <button type="button" className="text-gray-500 hover:text-gray-300 transition p-1">
                    <Paperclip className="w-4 h-4" />
                </button>
                <button 
                  type="submit" 
                  disabled={!inputValue.trim() || isGenerating}
                  className={`p-1.5 rounded-lg flex items-center justify-center transition-all \${(!inputValue.trim() || isGenerating) ? 'bg-white/5 text-gray-500 cursor-not-allowed' : 'bg-brand-pink text-white hover:bg-[#D40047] shadow-[0_0_15px_rgba(255,0,85,0.3)]'}`}
                >
                  <Send className="w-4 h-4" />
                </button>
            </div>
        </motion.form>
        <div className="text-center mt-3">
            <span className="text-[10px] text-gray-600 font-medium">Powered by Alock Data Engine</span>
        </div>
    </div>
  );
}