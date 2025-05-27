"use client";

import {
  useState,
  useRef,
  useEffect,
  type DragEvent,
  type ChangeEvent,
} from "react";
import { File, Search, X } from "lucide-react";

interface Prediction {
  class: string;
  confidence: number;
}

type Props = {
  onDetectTags?: (tags: string[]) => void;
};

export default function UploadBox({ onDetectTags }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const blob = item.getAsFile();
          if (blob) {
            setFile(blob);
            runRoboflowModel(blob);
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;

    setFile(droppedFile);
    runRoboflowModel(droppedFile);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    runRoboflowModel(selectedFile);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const runRoboflowModel = async (file: File) => {
    setIsProcessing(true);

    const toBase64 = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

    const base64 = await toBase64(file);

    const apiUrl = process.env.OBJECT_DETECTION_API_URL as string;
    const apiKey = process.env.OBJECT_DETECTION_API_KEY as string;

    if (!apiUrl || !apiKey) {
      console.error("API URL or API key is not defined.");
      return;
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: apiKey,
        inputs: {
          image: {
            type: "base64",
            value: base64,
          },
        },
      }),
    });

    const result = await response.json();
    //console.log("📦 Raw result:", result)
    const raw = result.outputs?.[0]?.predictions?.predictions || [];
    const predictions = raw as Prediction[];

    const detectedTags = predictions
      .filter((p) => p.confidence > 0.7)
      .map((p) => p.class);

    const uniqueTags = Array.from(new Set(detectedTags));
    if (uniqueTags.length === 0) {
      console.log("🔍 No tag detected.");
    }

    //console.log("🎯 Final tags:", uniqueTags)
    onDetectTags?.(uniqueTags);
    setIsProcessing(false);
  };

  return (
    <div className="bg-[#fcf4df]">
      <div className="mx-auto max-w-6xl overflow-hidden">
        <div
          className={`bg-[#202020] text-white text-center py-12 px-4 cursor-pointer transition-all ${
            isDragging ? "bg-[#303030] ring-2 ring-[#c27849]" : ""
          }`}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpeg, image/jpg"
            />

            <h1 className="text-6xl font-bold tracking-tight text-white drop-shadow-md">
              UPLOAD
            </h1>

            <div className="flex items-center justify-center mt-1">
              <span className="ml-2 text-white text-sm font-semibold">
                OR DRAG AND DROP / PASTE (Ctrl+V)
              </span>
            </div>
          </div>
        </div>
      </div>

      {(isProcessing || file) && (
        <div className="relative bg-[#1b1b1b] text-white font-bold tracking-tight py-2 px-4 border-b-2 border-[#BEC93B] text-sm">
          {/* ปุ่มลบที่ขวาบน */}
          {file && !isProcessing && (
            <button
              onClick={() => setFile(null)}
              className="absolute top-0 right-0 h-full px-4 bg-[#802520] hover:bg-[#802520c7] text-white flex items-center justify-center"
              title="Remove File"
            >
              <X size={16} strokeWidth={4} />
            </button>
          )}

          {isProcessing ? (
            <div className="flex items-center text-yellow-300">
              <Search className="mr-2" size={16} />
              DETECTING TAGS
            </div>
          ) : (
            <div className="flex items-center text-[#BEC93B] overflow-x-auto whitespace-nowrap pr-8">
              <File className="mr-2" size={16} />
              <span className="mr-2">SELECTED FILE :</span>
              <span className="uppercase">
                {file?.name} ({file?.size ? (file.size / 1024).toFixed(1) : "0"}
                KB)
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
