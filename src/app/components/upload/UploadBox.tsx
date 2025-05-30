"use client";

import {
  useState,
  useRef,
  useEffect,
  type DragEvent,
  type ChangeEvent,
} from "react";
import { File, Search, X } from "lucide-react";
import { CollapsibleButton } from "@/components/ui/collapsible-button";

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

    const apiUrl = process.env.NEXT_PUBLIC_OBJECT_DETECTION_API_URL as string;
    const apiKey = process.env.NEXT_PUBLIC_OBJECT_DETECTION_API_KEY as string;

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
      console.log("No tag detected.");
    }

    //console.log("🎯 Final tags:", uniqueTags)
    onDetectTags?.(uniqueTags);
    setIsProcessing(false);
  };

  return (
    <CollapsibleButton title="PRTS :: TAG-ANALYSIS" defaultOpen={true}>
      <div className="bg-[#fcf4df]">
        <div className="mx-auto max-w-6xl overflow-hidden relative">
          <p className="absolute top-2 right-2 px-3 py-1 rounded text-sm font-semibold bg-[#802520] text-white shadow-md z-10">
            BETA v1.0
          </p>
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

              <h1 className="text-2xl font-bold tracking-widest text-[#BEC93B]">
                → FEED OPERATOR IMAGE
              </h1>
              <div className="flex items-center justify-center mt-1">
                <span className="ml-2 text-gray-400 text-sm font-semibold">
                  SIGNAL: Awaiting input... | Paste or Drag file to begin
                  analysis
                </span>
              </div>
            </div>
          </div>
        </div>

        {(isProcessing || file) && (
          <div className="relative bg-[#111111] text-white font-mono py-3 px-4 border-t border-[#2f2f2f] text-sm rounded-b-xl shadow-inner">
            {/* ปุ่มลบไฟล์ */}
            {file && !isProcessing && (
              <button
                onClick={() => setFile(null)}
                className="absolute top-2 right-2 bg-[#802520] hover:bg-[#a83232] p-1.5 rounded-full"
                title="Remove File"
              >
                <X size={14} strokeWidth={3} />
              </button>
            )}

            {isProcessing ? (
              <div className="flex items-center text-yellow-400 animate-pulse">
                <Search className="mr-2" size={16} />
                ANALYSIS IN PROGRESS... [DECRYPTING TAGS]
              </div>
            ) : (
              <div className="flex items-center text-[#BEC93B] overflow-x-auto whitespace-nowrap pr-8">
                <File className="mr-2" size={16} />
                <span className="mr-2">INPUT RECEIVED ::</span>
                <span className="uppercase">
                  {file?.name} (
                  {file?.size ? (file.size / 1024).toFixed(1) : "0"} KB)
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </CollapsibleButton>
  );
}
