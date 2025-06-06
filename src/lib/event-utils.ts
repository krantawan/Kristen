export function getEventBadge(event: { type: string; status?: string }) {
  let typeBadge = "";
  switch (event.type) {
    case "main":
      typeBadge = "MAIN";
      break;
    case "side":
      typeBadge = "SIDE";
      break;
    case "integrated":
      typeBadge = "IS";
      break;
    case "record":
      typeBadge = "RECORD";
      break;
    case "cc":
      typeBadge = "CC";
      break;
    case "login":
      typeBadge = "LOGIN";
      break;
    default:
      typeBadge = event.type.toUpperCase();
      break;
  }

  // เฉพาะ SIDE ที่มี RERUN ได้
  const isRerun = event.type === "side" && event.status === "rerun";

  return isRerun ? `${typeBadge} RERUN` : typeBadge;
}

export function getEventColor(type: string): string {
  switch (type) {
    case "main":
      return "bg-[#802520] text-white";
    case "side":
      return "bg-orange-500 text-white";
    case "cc":
      return "bg-[#5C7F71] text-white";
    case "gacha":
      return "bg-purple-800 text-white";
    case "kernel":
      return "bg-blue-800 text-white";
    case "integrated":
      return "bg-green-700 text-white";
    case "record":
      return "bg-pink-600 text-white";
    case "login":
      return "bg-yellow-400 text-black";
    case "other":
      return "bg-indigo-500 text-white";
    default:
      return "bg-gray-400 text-white";
  }
}
