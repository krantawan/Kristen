"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Expand, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FullScreenImageViewer({
  imageUrl,
  alt = "Preview",
}: {
  imageUrl: string;
  alt?: string;
}) {
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  // drag image
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - start.x,
      y: e.clientY - start.y,
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((prev) => {
      const next = prev - e.deltaY * 0.001;
      return Math.min(Math.max(next, 1), 4);
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-2 right-2 z-30 bg-white/30 hover:bg-white/50 dark:bg-black/40 dark:hover:bg-black/70"
        onClick={() => setOpen(true)}
      >
        <Expand className="w-4 h-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="w-screen h-screen max-w-none p-0 flex justify-center items-center overflow-hidden border-none shadow-none rounded-none"
          onWheel={handleWheel}
        >
          <DialogTitle className="sr-only">Full Image</DialogTitle>

          <div className="relative">
            <DialogClose className="absolute top-2 right-2 z-50 text-white hover:text-red-500 bg-black/50 p-2">
              <XIcon className="w-10 h-10" />
              <span className="sr-only">Close</span>
            </DialogClose>

            <div
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                cursor: dragging ? "grabbing" : "grab",
              }}
              className={cn(
                "select-none",
                !dragging && "transition-transform duration-200 ease-in-out"
              )}
            >
              <Image
                src={imageUrl}
                alt={alt}
                width={1024}
                height={1024}
                className="object-contain w-auto h-auto max-h-[90vh] max-w-[90vw]"
                draggable={false}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
