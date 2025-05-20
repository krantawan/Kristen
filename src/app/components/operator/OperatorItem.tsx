import Image from "next/image"

interface OperatorItemProps {
  name: string
  image: string
}

export default function OperatorItem({ name, image }: OperatorItemProps) {
  return (
    <div className="flex flex-col items-center w-[120px] group">
  <div className="transition-transform duration-300 group-hover:-translate-y-1">
    {/* รูปภาพ */}
    <Image
      src={image}
      alt={name}
      width={120}
      height={120}
      className="object-cover rounded-t-md"
    />

    {/* เส้นขอบสีเขียว */}
    <div className="h-[4px] w-full bg-[#4b3d2e] group-hover:bg-[#BEC93B] transition-all duration-300" />

    {/* ชื่อ */}
    <div className="w-full bg-[#4b3d2e] text-center rounded-b-md py-2">
      <span className="text-white font-bold text-md transition-colors duration-300 group-hover:text-[#BEC93B]">
        {name}
      </span>
    </div>
  </div>
</div>






  )
}
