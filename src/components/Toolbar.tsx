import React from 'react';
import { Pencil, Square, Circle, Eraser, Upload, Download, Type, MousePointer } from 'lucide-react';
import { Tool } from '../types';

interface ToolbarProps {
  tool: Tool;
  setTool: (tool: Tool) => void;
  color: string;
  setColor: (color: string) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  lineWidth: number;
  setLineWidth: (width: number) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
}

export default function Toolbar({
  tool,
  setTool,
  color,
  setColor,
  backgroundColor,
  setBackgroundColor,
  lineWidth,
  setLineWidth,
  fontSize,
  setFontSize,
  onImageUpload,
  onSave,
}: ToolbarProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex gap-2">
        <button
          onClick={() => setTool('select')}
          className={`p-2 rounded ${
            tool === 'select' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
          title="Select"
        >
          <MousePointer size={20} />
        </button>
        <button
          onClick={() => setTool('pencil')}
          className={`p-2 rounded ${
            tool === 'pencil' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
          title="Pencil"
        >
          <Pencil size={20} />
        </button>
        <button
          onClick={() => setTool('rectangle')}
          className={`p-2 rounded ${
            tool === 'rectangle' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
          title="Rectangle"
        >
          <Square size={20} />
        </button>
        <button
          onClick={() => setTool('circle')}
          className={`p-2 rounded ${
            tool === 'circle' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
          title="Circle"
        >
          <Circle size={20} />
        </button>
        <button
          onClick={() => setTool('text')}
          className={`p-2 rounded ${
            tool === 'text' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
          title="Text"
        >
          <Type size={20} />
        </button>
        <button
          onClick={() => setTool('eraser')}
          className={`p-2 rounded ${
            tool === 'eraser' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
          title="Eraser"
        >
          <Eraser size={20} />
        </button>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-600">Drawing Color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer"
            title="Drawing Color"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-600">Background</label>
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer"
            title="Background Color"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-600">Line Width</label>
          <input
            type="range"
            min="1"
            max="20"
            value={lineWidth}
            onChange={(e) => setLineWidth(parseInt(e.target.value))}
            className="w-32"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-600">Font Size</label>
          <input
            type="range"
            min="12"
            max="72"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="w-32"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <label className="p-2 rounded bg-gray-100 cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="hidden"
          />
          <Upload size={20} />
        </label>
        <button
          onClick={onSave}
          className="p-2 rounded bg-green-500 text-white"
          title="Save as BMP"
        >
          <Download size={20} />
        </button>
      </div>
    </div>
  );
}