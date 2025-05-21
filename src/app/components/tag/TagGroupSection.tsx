import TagButton from "@/app/components/tag/TagButton"

export default function TagGroupSection({
  title,
  tags,
}: {
  title: string
  tags: string[]
}) {
  return (
    <section className="mb-6">
      {/* Header Bar */}
      <div className="flex items-center">
        <div className="h-1 w-6 bg-[#BEC93B]" />
        <div className="h-1 w-6 bg-[#F6B347]" />
        <div className="h-1 w-6 bg-[#802520]" />
      </div>

      {/* Title */}
      <h2 className="text-2xl font-black tracking-tight mb-4 font-roboto">
        {title}
      </h2>

      {/* Tag Buttons */}
      <div className="min-h-[48px] flex flex-wrap gap-3">
        {tags.map((tag) => (
          <TagButton 
          key={tag} 
          label={tag} 
          className={tag === "Top Operator" ? "text-yellow-400" : ""}
        />
        ))}
      </div>
    </section>
  )
}
