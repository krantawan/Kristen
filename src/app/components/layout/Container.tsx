import { cn } from "@/lib/utils";

export default function Container({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <>
      {title && (
        <div className="p-10">
          <h1
            className={cn(
              "pb-1 text-center text-4xl uppercase title-header dark:text-[#FFF] text-[#222]"
            )}
          >
            {title}
          </h1>
        </div>
      )}
      <div className="max-w-7xl mx-auto rounded-md ">
        <div className="flex h-2 w-full">
          <div className="bg-[#5C7F71] w-[60%]" />
          <div className="bg-[#d4a940] w-[30%]" />
          <div className="bg-[#802520] w-[10%]" />
        </div>
        <div className="transition-colors duration-300">{children}</div>
        <div className="h-2 bg-[#c8cc36]" />
      </div>
    </>
  );
}
