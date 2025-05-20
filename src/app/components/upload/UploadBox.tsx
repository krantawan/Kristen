"use client"

export default function UploadBox() {
  return (
    <div className="bg-[#fcf4df]">
      <div className="mx-auto max-w-5xl overflow-hidden">
        <div className="bg-[#202020] text-white text-center py-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold tracking-tight text-white drop-shadow-md">
            UPLOAD
          </h1>

          <div className="flex items-center justify-center mt-1">
            <div className="h-[10px] w-[9%] bg-[#c27849]"></div>
            <span className="ml-2 text-white text-sm font-semibold">
              OR DRAG AND DROP
            </span> 
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
