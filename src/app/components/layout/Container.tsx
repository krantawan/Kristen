export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-6xl mx-auto shadow-lg rounded-md bg-[#fff9eb]">
      <div className="flex h-2">
        <div className="bg-[#5C7F71] flex-1" />
        <div className="bg-[#d4a940] flex-1" />
        <div className="bg-[#802520] flex-1" />
      </div>
      <div className="bg-[#fdf5dc] min-h-[1000px]">{children}</div>
      <div className="h-2 bg-[#c8cc36]" />
    </div>
  )
}
