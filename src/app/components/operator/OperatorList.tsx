import OperatorItem from "./OperatorItem"

const operators = [
  { name: "Ifrit", image: "/operators/ifrit.png" },
  { name: "SilverAsh", image: "/operators/silverash.png" },
  { name: "Exusiai", image: "/operators/exusiai.png" },
]

export default function OperatorList({ title }: { title: string }) {
  return (
    <>
    <div className="mb-6">
        <div className="flex items-center">
            <div className="h-1 w-6 bg-[#BEC93B]" />
            <div className="h-1 w-6 bg-[#F6B347]" />
            <div className="h-1 w-6 bg-[#802520]" />
        </div>
        <h2 className="text-2xl font-black tracking-tight mb-4 font-roboto">
        {title}
        </h2>
    </div>
    <div className="flex flex-wrap justify-start gap-1">
      {operators.map((op) => (
        <OperatorItem key={op.name} name={op.name} image={op.image} />
      ))}
    </div>
    </>
  )
}
