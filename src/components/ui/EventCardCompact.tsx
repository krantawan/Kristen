import { format } from "date-fns";
import { parseISO } from "date-fns";
import { cn } from "@/lib/utils";

type Props = {
  event: {
    title: string;
    start: string;
    end: string;
    type: string;
    image?: string;
  };
  statusText: string;
  borderColor?: string;
};

export default function EventCardCompact({
  event,
  statusText,
  borderColor = "border-[#333]",
}: Props) {
  const formatDate = (date: string) => format(parseISO(date), "d MMM yyyy");

  const badgeColor = cn(
    "absolute top-1 right-1 text-[10px] px-2 py-[2px] rounded uppercase font-bold shadow",
    {
      "bg-[#802520] text-white": event.type === "main",
      "bg-[#BEC93B] text-black": event.type === "cc",
      "bg-[#F6B347] text-black": event.type === "side",
      "bg-white text-black": !["main", "cc", "side"].includes(event.type),
    }
  );

  return (
    <div
      key={event.title}
      className={`rounded relative p-3 shadow text-white overflow-hidden min-h-[72px] border-b-4 ${borderColor}`}
      style={{
        backgroundImage: event.image ? `url(${event.image})` : undefined,
        backgroundSize: "cover",
      }}
    >
      <div className="backdrop-blur-sm bg-black/40 p-2 rounded">
        <span className={badgeColor}>{event.type}</span>
        <div className="font-semibold text-sm">{event.title}</div>
        <div className="text-xs text-gray-200">
          {formatDate(event.start)} – {formatDate(event.end)}
        </div>
        <div className="text-xs mt-1 text-yellow-300">{statusText}</div>
      </div>
    </div>
  );
}
