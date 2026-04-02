import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(
  persist(
    (set) => ({
      prompt: '',
      setPrompt: (prompt) => set({ prompt }),
      history: [], // Elements should be { type: 'user' | 'ai', content: string, timestamp: number }
      addHistory: (item) => set((state) => ({ history: [...state.history, item] })),
      clearHistory: () => set({ history: [] }),
      loadingStep: 'idle',
      setLoadingStep: (step) => set({ loadingStep: step }),
      generatedCode: '',
      setGeneratedCode: (code) => set({ generatedCode: code }),
      currentComponent: null,
      setCurrentComponent: (component) => set({ currentComponent: component }),
      loading: false,
      setLoading: (loading) => set({ loading }),
      error: null,
      setError: (error) => set({ error }),
      iframeUrl: null,
      setIframeUrl: (url) => set({ iframeUrl: url }),

      // UI states
      activeTab: 'preview', // 'preview' | 'code'
      setActiveTab: (tab) => set({ activeTab: tab }),
      viewport: 'desktop', // 'desktop' | 'tablet' | 'mobile'
      setViewport: (vp) => set({ viewport: vp }),
      isSidebarOpen: true,
      setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

      // Navigation
      currentView: 'landing', // 'landing' | 'canvas'
      setCurrentView: (view) => set({ currentView: view }),
    }),
    {
      name: 'neura-store', // localStorage key
      partialize: (state) => ({
        // Only persist meaningful state, not transient/ephemeral fields
        history: state.history,
        generatedCode: state.generatedCode,
        currentComponent: state.currentComponent,
        iframeUrl: state.iframeUrl,
        activeTab: state.activeTab,
        viewport: state.viewport,
        isSidebarOpen: state.isSidebarOpen,
        currentView: state.currentView,
      }),
    }
  )
)