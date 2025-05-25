"use client"

import { useState, useRef, useEffect, type DragEvent, type ChangeEvent } from "react"

interface Prediction {
  class: string
  confidence: number
}

type Props = {
  onDetectTags?: (tags: string[]) => void
}

export default function UploadBox({ onDetectTags }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const allowedTags = [
    "Top Operator", "Medic", "Specialist", "Starter", "Debuff",
    "Healing", "Defender", "Supporter", "Vanguard", "Guard",
    "Melee", "Ranged", "Sniper", "Caster", "Nuker", "Slow", "DPS", "AoE", "Robot"
  ]

  const tagAlias: Record<string, string> = {
    Defense: "Defender",
    Support: "Supporter",
    Shift: "Push",
    Nuke: "Nuker"
  }

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const blob = item.getAsFile()
          if (blob) {
            setFile(blob)
            runRoboflowModel(blob)
          }
        }
      }
    }

    window.addEventListener("paste", handlePaste)
    return () => window.removeEventListener("paste", handlePaste)
  }, [])

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files?.[0]
    if (!droppedFile) return

    setFile(droppedFile)
    runRoboflowModel(droppedFile)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    runRoboflowModel(selectedFile)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const runRoboflowModel = async (file: File) => {
    setIsProcessing(true)

    const toBase64 = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = error => reject(error)
      })

    const base64 = await toBase64(file)

    const apiUrl = process.env.NEXT_PUBLIC_OBJECT_DETECTION_API_URL as string
    const apiKey = process.env.NEXT_PUBLIC_OBJECT_DETECTION_API_KEY as string

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        inputs: {
          image: {
            type: "base64",
            value: base64
          }
        }
      })
    })

    const result = await response.json()
    console.log("📦 Raw result:", result)

    const raw = result.outputs?.[0]?.predictions?.predictions || []
    const predictions = raw as Prediction[]
    const classes = predictions.map(p => p.class)
    console.log("🧠 All predictions:", classes)

    const detectedTags = predictions
      .filter(p => p.confidence > 0.4)
      .map(p => tagAlias[p.class] || p.class)
      .filter(tag => allowedTags.includes(tag))

    const uniqueTags = Array.from(new Set(detectedTags))
    if (uniqueTags.length === 0) {
      console.log("🔍 No tag detected.")
    }

    console.log("🎯 Final tags:", uniqueTags)
    onDetectTags?.(uniqueTags)
    setIsProcessing(false)
  }

  return (
    <div className="bg-[#fcf4df]">
      <div className="mx-auto max-w-5xl overflow-hidden">
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

            <h1 className="text-6xl font-bold tracking-tight text-white drop-shadow-md">UPLOAD</h1>

            <div className="flex items-center justify-center mt-1">
              <div className="h-[10px] w-[9%] bg-[#c27849]"></div>
              <span className="ml-2 text-white text-sm font-semibold">
                OR DRAG AND DROP / PASTE (Ctrl+V)
              </span>
            </div>

            {isProcessing && (
              <p className="mt-4 text-sm text-yellow-300">🔎 Detecting tags...</p>
            )}

            {file && !isProcessing && (
              <div className="mt-6 text-left max-w-md mx-auto">
                <p className="text-sm font-medium mb-2">Selected file:</p>
                <ul className="text-sm text-gray-300 flex justify-between items-center">
                  <li className="truncate">
                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </li>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setFile(null)
                    }}
                    className="ml-2 text-red-400 hover:text-red-600 text-lg font-bold"
                  >
                    ✕
                  </button>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
