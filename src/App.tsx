import React from 'react';
import Editor from './components/Editor';
import { Image } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center mb-8">
          <Image className="w-8 h-8 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">Canvas Editor</h1>
        </div>
        <Editor />
      </div>
    </div>
  );
}

export default App;