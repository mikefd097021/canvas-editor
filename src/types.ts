export type Tool = 'pencil' | 'rectangle' | 'circle' | 'eraser' | 'text' | 'select';

export interface Position {
  x: number;
  y: number;
}

export interface ImageObject {
  element: HTMLImageElement;
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
}

export interface TextObject {
  text: string;
  x: number;
  y: number;
  color: string;
  fontSize: number;
  isSelected: boolean;
}