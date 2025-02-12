import React, { useRef, useEffect, useState } from 'react';
import { Tool, Position, ImageObject, TextObject } from '../types';

interface CanvasProps {
  tool: Tool;
  color: string;
  backgroundColor: string;
  lineWidth: number;
  fontSize: number;
  isDrawing: boolean;
  setIsDrawing: (drawing: boolean) => void;
  startPos: Position;
  setStartPos: (pos: Position) => void;
  images: ImageObject[];
  setImages: React.Dispatch<React.SetStateAction<ImageObject[]>>;
  texts: TextObject[];
  setTexts: React.Dispatch<React.SetStateAction<TextObject[]>>;
}

export default function Canvas({
  tool,
  color,
  backgroundColor,
  lineWidth,
  fontSize,
  isDrawing,
  setIsDrawing,
  startPos,
  setStartPos,
  images,
  setImages,
  texts,
  setTexts,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedObject, setSelectedObject] = useState<'image' | 'text' | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [resizing, setResizing] = useState(false);
  const [inputPosition, setInputPosition] = useState<Position | null>(null);

  // 更新背景顏色的 effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 填充背景顏色
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 重繪所有圖片
    images.forEach((img) => {
      ctx.drawImage(img.element, img.x, img.y, img.width, img.height);
      if (img.isSelected) {
        drawSelectionBox(ctx, img.x, img.y, img.width, img.height);
      }
    });

    // 重繪所有文字
    texts.forEach((text) => {
      ctx.font = `${text.fontSize}px Arial`;
      ctx.fillStyle = text.color;
      ctx.fillText(text.text, text.x, text.y);
      if (text.isSelected) {
        const metrics = ctx.measureText(text.text);
        drawSelectionBox(ctx, text.x, text.y - text.fontSize, metrics.width, text.fontSize);
      }
    });
  }, [backgroundColor, images, texts]);

  const drawSelectionBox = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    ctx.strokeStyle = '#0066ff';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(x - 5, y - 5, width + 10, height + 10);
    ctx.setLineDash([]);
    
    // Draw resize handle
    ctx.fillStyle = '#0066ff';
    ctx.fillRect(x + width - 5, y + height - 5, 10, 10);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'select') {
      // 檢查是否點擊調整大小的控制點
      if (selectedObject && selectedIndex !== -1) {
        const obj = selectedObject === 'image' 
          ? images[selectedIndex] 
          : texts[selectedIndex];
        const resizeHandle = {
          x: (obj as ImageObject).x + (obj as ImageObject).width - 5,
          y: (obj as ImageObject).y + (obj as ImageObject).height - 5,
          width: 10,
          height: 10
        };

        if (
          x >= resizeHandle.x &&
          x <= resizeHandle.x + resizeHandle.width &&
          y >= resizeHandle.y &&
          y <= resizeHandle.y + resizeHandle.height
        ) {
          setResizing(true);
          return;
        }
      }

      // 檢查物件選擇
      let found = false;
      
      // 首先檢查圖片
      images.forEach((img, index) => {
        if (
          x >= img.x &&
          x <= img.x + img.width &&
          y >= img.y &&
          y <= img.y + img.height
        ) {
          setSelectedObject('image');
          setSelectedIndex(index);
          setImages(prev => prev.map((i, idx) => ({
            ...i,
            isSelected: idx === index
          })));
          setTexts(prev => prev.map(t => ({ ...t, isSelected: false })));
          found = true;
        }
      });

      if (!found) {
        // 檢查文字
        texts.forEach((text, index) => {
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          
          ctx.font = `${text.fontSize}px Arial`;
          const metrics = ctx.measureText(text.text);
          
          if (
            x >= text.x &&
            x <= text.x + metrics.width &&
            y >= text.y - text.fontSize &&
            y <= text.y
          ) {
            setSelectedObject('text');
            setSelectedIndex(index);
            setTexts(prev => prev.map((t, idx) => ({
              ...t,
              isSelected: idx === index
            })));
            setImages(prev => prev.map(i => ({ ...i, isSelected: false })));
            found = true;
          }
        });
      }

      if (!found) {
        setSelectedObject(null);
        setSelectedIndex(-1);
        setImages(prev => prev.map(i => ({ ...i, isSelected: false })));
        setTexts(prev => prev.map(t => ({ ...t, isSelected: false })));
      }
    } else if (tool === 'text') {
      setInputPosition({ x, y });
    } else {
      setIsDrawing(true);
      setStartPos({ x, y });

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = tool === 'eraser' ? backgroundColor : color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (resizing && selectedObject === 'image' && selectedIndex !== -1) {
      setImages(prev => prev.map((img, idx) => {
        if (idx === selectedIndex) {
          const width = x - img.x;
          const aspectRatio = img.element.width / img.element.height;
          return {
            ...img,
            width: Math.max(50, width),
            height: Math.max(50, width / aspectRatio)
          };
        }
        return img;
      }));
      return;
    }

    if (tool === 'select' && isDrawing && selectedObject) {
      const dx = x - startPos.x;
      const dy = y - startPos.y;

      if (selectedObject === 'image') {
        setImages(prev => prev.map((img, idx) => {
          if (idx === selectedIndex) {
            return {
              ...img,
              x: img.x + dx,
              y: img.y + dy
            };
          }
          return img;
        }));
      } else {
        setTexts(prev => prev.map((text, idx) => {
          if (idx === selectedIndex) {
            return {
              ...text,
              x: text.x + dx,
              y: text.y + dy
            };
          }
          return text;
        }));
      }

      setStartPos({ x, y });
      return;
    }

    if (!isDrawing || tool === 'text') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (tool === 'pencil' || tool === 'eraser') {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      // 繪製當前畫布內容到臨時畫布
      tempCtx.fillStyle = backgroundColor;
      tempCtx.fillRect(0, 0, canvas.width, canvas.height);
      tempCtx.drawImage(canvas, 0, 0);
      
      // 繪製新的形狀
      tempCtx.strokeStyle = color;
      tempCtx.lineWidth = lineWidth;
      tempCtx.beginPath();

      if (tool === 'rectangle') {
        tempCtx.rect(
          startPos.x,
          startPos.y,
          x - startPos.x,
          y - startPos.y
        );
      } else if (tool === 'circle') {
        const radius = Math.sqrt(
          Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2)
        );
        tempCtx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      }

      tempCtx.stroke();
      
      // 更新主畫布
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(tempCanvas, 0, 0);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setResizing(false);
  };

  const handleTextInput = (text: string) => {
    if (text && inputPosition) {
      setTexts(prev => [...prev, {
        text,
        x: inputPosition.x,
        y: inputPosition.y,
        color,
        fontSize,
        isSelected: false
      }]);
      setInputPosition(null);
    }
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="border border-gray-300 rounded-lg w-full cursor-crosshair bg-white"
      />
      {inputPosition && (
        <input
          type="text"
          autoFocus
          className="absolute bg-transparent border-b border-gray-400 outline-none"
          style={{
            left: inputPosition.x,
            top: inputPosition.y - fontSize,
            fontSize: `${fontSize}px`,
            color
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleTextInput(e.currentTarget.value);
            }
          }}
          onBlur={(e) => handleTextInput(e.target.value)}
        />
      )}
    </div>
  );
}