import React, { useState } from 'react';
import Toolbar from './Toolbar';
import Canvas from './Canvas';
import type { Tool, ImageObject, TextObject } from '../types';

export default function Editor() {
  const [tool, setTool] = useState<Tool>('pencil');
  const [color, setColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [lineWidth, setLineWidth] = useState(2);
  const [fontSize, setFontSize] = useState(24);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [images, setImages] = useState<ImageObject[]>([]);
  const [texts, setTexts] = useState<TextObject[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgElement = document.createElement('img');
      imgElement.onload = () => {
        const aspectRatio = imgElement.width / imgElement.height;
        const newWidth = Math.min(400, imgElement.width);
        const newHeight = newWidth / aspectRatio;

        setImages(prev => [...prev, {
          element: imgElement,
          x: 50,
          y: 50,
          width: newWidth,
          height: newHeight,
          isSelected: false
        }]);
      };
      imgElement.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const saveImage = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'canvas-drawing.bmp';
    canvas.toBlob((blob) => {
      if (!blob) return;
      link.href = URL.createObjectURL(blob);
      link.click();
    }, 'image/bmp');
  };

  return (
    <div className="flex flex-col items-center p-4 max-w-5xl mx-auto">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full">
        <Toolbar
          tool={tool}
          setTool={setTool}
          color={color}
          setColor={setColor}
          backgroundColor={backgroundColor}
          setBackgroundColor={setBackgroundColor}
          lineWidth={lineWidth}
          setLineWidth={setLineWidth}
          fontSize={fontSize}
          setFontSize={setFontSize}
          onImageUpload={handleImageUpload}
          onSave={saveImage}
        />
        <Canvas
          tool={tool}
          color={color}
          backgroundColor={backgroundColor}
          lineWidth={lineWidth}
          fontSize={fontSize}
          isDrawing={isDrawing}
          setIsDrawing={setIsDrawing}
          startPos={startPos}
          setStartPos={setStartPos}
          images={images}
          setImages={setImages}
          texts={texts}
          setTexts={setTexts}
        />
      </div>
    </div>
  );
}