export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-6xl mx-auto shadow-lg rounded-md bg-[#fff9eb] ">
      <div className="flex h-2 w-full">
        <div className="bg-[#5C7F71] w-[60%]" />
        <div className="bg-[#d4a940] w-[30%]" />
        <div className="bg-[#802520] w-[10%]" />
      </div>
      <div className="bg-[#fdf5dc] min-h-[1000px] dark:bg-[#1a1a1a] transition-colors duration-300">
        {children}
      </div>
      <div className="h-2 bg-[#c8cc36]" />
    </div>
  );
}
