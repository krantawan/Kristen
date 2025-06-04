"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type DragEvent,
  type ChangeEvent,
} from "react";
import { File as FileIcon, Search, X } from "lucide-react";
import { CollapsibleButton } from "@/components/ui/collapsible-button";
import { useLocale, useTranslations } from "next-intl";

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

  const t = useTranslations("components.RecruitmentPage.upload");

  const runRoboflowModel = useCallback(
    async (file: File) => {
      //console.log("File received in model:", file);
      setIsProcessing(true);
      setFile(file);

      const toBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
        });

      const base64 = await toBase64(file);

      const response = await fetch("/api/detect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ base64 }),
      });

      const result = await response.json();
      const raw = result.outputs?.[0]?.predictions?.predictions || [];
      const predictions = raw as Prediction[];

      const detectedTags = predictions
        .filter((p) => p.confidence > 0.5)
        .map((p) => p.class);

      const uniqueTags = Array.from(new Set(detectedTags));
      if (uniqueTags.length === 0) {
        console.log("No tag detected.");
      }

      onDetectTags?.(uniqueTags);
      setIsProcessing(false);
    },
    [onDetectTags]
  );

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const blob = item.getAsFile();
          if (blob) {
            runRoboflowModel(blob);
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [runRoboflowModel]);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) runRoboflowModel(droppedFile);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) runRoboflowModel(selectedFile);
    e.target.value = "";
  };

  const locale = useLocale();

  return (
    <CollapsibleButton title={t("title")} defaultOpen={true}>
      <div>
        <div className="mx-auto max-w-6xl overflow-hidden relative">
          <p
            className={`absolute top-2 right-2 px-3 py-1 rounded text-sm bg-[#802520] text-white shadow-md z-10 ${
              locale === "th" ? "" : "font-semibold"
            }`}
          >
            {t("version")} v1.0
          </p>
          <div
            className={`bg-[#202020] text-white text-center py-12 px-4 cursor-pointer transition-all ${
              isDragging ? "bg-[#303030] ring-2 ring-[#c27849]" : ""
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpeg, image/jpg"
            />
            <h1 className="text-2xl font-bold tracking-widest text-[#BEC93B]">
              → {t("main_upload")}
            </h1>
            <div
              className={`mt-1 text-gray-400 text-sm ${
                locale === "th" ? "" : "font-semibold"
              }`}
            >
              {t("signal")} | {t("paste_or_drag")}
            </div>
          </div>
        </div>

        {(isProcessing || file) && (
          <div
            className={`relative bg-[#111111] text-white ${
              locale === "th" ? "" : "font-mono"
            } py-3 px-4 border-t border-[#2f2f2f] text-sm rounded-b-xl shadow-inner`}
          >
            {file && !isProcessing && (
              <button
                onClick={() => {
                  setFile(null);
                  onDetectTags?.([]);
                }}
                className="absolute top-2 right-2 bg-[#802520] hover:bg-[#a83232] p-1.5 rounded-full"
                title={t("clear")}
              >
                <X size={14} strokeWidth={3} />
              </button>
            )}

            {isProcessing ? (
              <div className="flex items-center text-yellow-400 animate-pulse">
                <Search className="mr-2" size={16} />
                {t("analysis_in_progress")}
              </div>
            ) : (
              <div
                className={`flex items-center text-[#BEC93B] overflow-x-auto whitespace-nowrap pr-8 ${
                  locale === "th" ? "" : "font-semibold"
                }`}
              >
                <FileIcon className="mr-2" size={16} />
                <span className="mr-2">{t("input_received")} ::</span>
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
