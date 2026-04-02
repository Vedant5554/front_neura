import { WebContainer } from '@webcontainer/api';
import { useStore } from '../store';

let webcontainerInstance = null;

export function useWebContainer() {
  const { setLoadingStep, setIframeUrl, iframeUrl, loadingStep } = useStore();

  async function bootAndMount(code) {
    try {
      setLoadingStep('building');
      
      if (!webcontainerInstance) {
        webcontainerInstance = await WebContainer.boot();
      }

      const files = {
        'package.json': {
          file: {
            contents: JSON.stringify({
              name: "preview",
              type: "module",
              dependencies: {
                "react": "^18.2.0",
                "react-dom": "^18.2.0",
                "lucide-react": "latest"
              },
              devDependencies: {
                "@vitejs/plugin-react": "^4.0.0",
                "vite": "^4.4.5"
              },
              scripts: {
                "dev": "vite"
              }
            }, null, 2)
          }
        },
        'index.html': {
          file: {
            contents: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>body { background-color: #0f172a; color: white; }</style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`
          }
        },
        'vite.config.js': {
          file: {
            contents: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({ plugins: [react()] })`
          }
        },
        'src': {
          directory: {
            'main.jsx': {
              file: {
                contents: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>,
)`
              }
            },
            'App.jsx': {
              file: {
                contents: code
              }
            }
          }
        }
      };

      await webcontainerInstance.mount(files);

      const installProcess = await webcontainerInstance.spawn('npm', ['install']);
      await installProcess.exit;

      const devProcess = await webcontainerInstance.spawn('npm', ['run', 'dev']);

      webcontainerInstance.on('server-ready', (port, url) => {
        setIframeUrl(url);
        setLoadingStep('ready');
      });
      
    } catch (err) {
      console.error(err);
      setLoadingStep('idle');
    }
  }

  return {
    bootAndMount,
    startWebContainer: bootAndMount,
    previewUrl: iframeUrl,
    isBooted: loadingStep === 'ready',
    isBuilding: loadingStep === 'building',
  };
}