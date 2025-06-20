function parseRichText(
  text?: string | null,
  blackboard: Record<string, number> = {}
): React.ReactNode[] {
  if (!text) return [];

  const regex =
    /(<@ba\.\w+>|<\$ba\.\w+>)([+-]?)(\{([\w_]+)(?::(\d+))?%?\})?(.*?)<\/>|(\{([\w_]+)\})/g;

  const result: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      // มี tag ครอบ เช่น <@ba.kw>{key:0%}</>
      const tag = match[1];
      const sign = match[2];
      const key = match[4];
      const precisionStr = match[5];
      const fallbackText = match[6];

      const precision = precisionStr ? parseInt(precisionStr) : 0;
      const value = key && blackboard[key];

      let content = fallbackText;

      if (value !== undefined) {
        const formatted = (value * 100).toFixed(precision);
        content = `${sign}${formatted}${precisionStr ? "%" : ""}`;
      }

      const color =
        tag === "<@ba.kw>"
          ? "text-yellow-400"
          : tag === "<$ba.stun>"
          ? "text-blue-400"
          : tag === "<@ba.talpu>"
          ? "text-green-400"
          : tag === "<@ba.vup>"
          ? "text-red-400"
          : tag === "<@ba.vdown>"
          ? "text-cyan-400"
          : "text-white";

      result.push(
        <span key={result.length} className={color}>
          {content}
        </span>
      );
    } else if (match[7]) {
      // กรณี fallback แบบ {key}
      const key = match[8];
      const value = blackboard[key];
      const content = value !== undefined ? value : `{${key}}`;
      result.push(
        <span key={result.length} className="text-red-400">
          {content}
        </span>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result;
}

export default parseRichText;
