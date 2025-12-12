"use client";

import { useContext, useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { Cross1Icon, ZoomInIcon, ZoomOutIcon, ResetIcon } from "@radix-ui/react-icons";

import { Dropzone } from "./Dropzone";
import { imageContext } from "@/providers";
import { Button } from "./ui/button";

export const ImageDropzoneBox = () => {
  const { file, handleImageChange, handleRemoveImage } =
    useContext(imageContext);

  // Zoom state
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const MIN_SCALE = 0.5;
  const MAX_SCALE = 5;
  const ZOOM_STEP = 0.25;

  const onDrop = (acceptedFiles: File[]) => {
    const [file] = acceptedFiles;
    handleImageChange(file);
    // Reset zoom when new image is uploaded
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + ZOOM_STEP, MAX_SCALE));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - ZOOM_STEP, MIN_SCALE));
  }, []);

  const handleReset = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  // Mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    setScale((prev) => Math.max(MIN_SCALE, Math.min(prev + delta, MAX_SCALE)));
  }, []);

  // Pan functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  }, [scale, position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Reset position when scale returns to 1
  useEffect(() => {
    if (scale <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, [scale]);

  const image = file != null ? URL.createObjectURL(file) : null;

  return (
    <div className="min-h-[400px] flex flex-col w-full relative rounded-md border border-input bg-transparent shadow-sm">
      {image ? (
        <>
          {/* Zoom Controls Toolbar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-input bg-muted/30">
            <div className="flex items-center gap-1">
              <Button
                onClick={handleZoomOut}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={scale <= MIN_SCALE}
                title="Zoom Out (Ctrl+-)"
              >
                <ZoomOutIcon className="h-4 w-4" />
              </Button>

              <div className="flex items-center justify-center min-w-[60px] px-2 py-1 text-xs font-medium bg-background rounded border">
                {Math.round(scale * 100)}%
              </div>

              <Button
                onClick={handleZoomIn}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={scale >= MAX_SCALE}
                title="Zoom In (Ctrl++)"
              >
                <ZoomInIcon className="h-4 w-4" />
              </Button>

              <div className="w-px h-6 bg-border mx-1" />

              <Button
                onClick={handleReset}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                title="Reset View"
              >
                <ResetIcon className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {scale > 1 ? "Drag to pan" : "Scroll to zoom"}
              </span>
              <Button
                onClick={() => {
                  handleRemoveImage();
                  handleReset();
                }}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                title="Remove Image"
              >
                <Cross1Icon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Image Viewer */}
          <div
            ref={containerRef}
            className="flex-1 min-h-[350px] overflow-hidden bg-[#1a1a1a] relative"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: isDragging ? "grabbing" : scale > 1 ? "grab" : "zoom-in" }}
          >
            <div
              ref={imageRef}
              className="absolute inset-0 flex items-center justify-center transition-transform duration-75"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: "center center",
              }}
            >
              <Image
                className="max-w-full max-h-full object-contain select-none"
                src={image}
                alt="Document preview"
                width={800}
                height={800}
                draggable={false}
                priority
              />
            </div>

            {/* Zoom indicator overlay */}
            {scale !== 1 && (
              <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/70 text-white text-xs rounded">
                {Math.round(scale * 100)}% zoom
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center p-4">
          <Dropzone
            title="Drag and drop an image here, or click to select an image"
            accept={{ "image/*": [] }}
            onDrop={onDrop}
          />
        </div>
      )}
    </div>
  );
};
