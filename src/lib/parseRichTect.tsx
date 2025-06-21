import React from "react";

function parseRichText(
  text?: string | null,
  blackboard: Record<string, number> = {}
): React.ReactNode[] {
  if (!text) return [];

  const highlightNumbers = (chunk: string): React.ReactNode[] => {
    const split = chunk.split(
      /(?<![a-zA-Z])(\(?[-+]?\d+(?:\.\d+)?(?:%|s| SP| tiles)?\)?)(?![a-zA-Z])/g
    );
    return React.Children.toArray(
      split.map((part, index) => {
        if (/^[-+]?\d+(?:\.\d+)?(?:%|s| SP| tiles)?$/.test(part)) {
          const color = part.includes("%")
            ? "text-yellow-400"
            : part.includes("s")
            ? "text-cyan-400"
            : "text-emerald-400";
          return (
            <span
              key={`num-${index}-${part}-${Math.random()}`}
              className={color}
            >
              {part}
            </span>
          );
        }
        return part;
      })
    );
  };

  const getTagColor = (tag: string): string => {
    if (tag.includes("@ba.kw")) return "text-yellow-400"; // Keyword
    if (tag.includes("$ba.stun")) return "text-blue-400"; // Stun
    if (tag.includes("@ba.talpu")) return "text-green-400"; // Talent Passive Up
    if (tag.includes("@ba.vup")) return "text-red-400"; // Buff (up)
    if (tag.includes("@ba.vdown")) return "text-cyan-400"; // Debuff (down)
    if (tag.includes("@ba.rem")) return "text-purple-400"; // Tied, link, etc.
    if (tag.includes("$ba.binding")) return "text-pink-400"; // Binding-related
    if (tag.includes("$ba.overdrive")) return "text-rose-400"; // Overdrive Mode
    if (tag.includes("$ba.inspire")) return "text-lime-400";
    if (tag.includes("burning")) return "text-orange-400"; // Burning damage

    return "text-white"; // Default
  };

  // State-based parser for better handling of nested/overlapping tags
  const result: React.ReactNode[] = [];
  let i = 0;
  let currentText = "";
  const currentTags: string[] = [];

  const flushText = () => {
    if (currentText) {
      if (currentTags.length > 0) {
        // Apply the most recent tag color
        const lastTag = currentTags[currentTags.length - 1];
        const color = getTagColor(lastTag);
        const highlighted = highlightNumbers(currentText);
        result.push(
          <span key={result.length} className={color}>
            {highlighted}
          </span>
        );
      } else {
        result.push(...highlightNumbers(currentText));
      }
      currentText = "";
    }
  };

  while (i < text.length) {
    if (text[i] === "<") {
      // Look for tag start
      const tagMatch = text.slice(i).match(/^<([@$]ba\.[\w.]+)>/);
      if (tagMatch) {
        flushText();
        currentTags.push(tagMatch[1]);
        i += tagMatch[0].length;
        continue;
      }

      // Look for tag end
      const endTagMatch = text.slice(i).match(/^<\/>/);
      if (endTagMatch) {
        flushText();
        currentTags.pop();
        i += endTagMatch[0].length;
        continue;
      }

      // Look for self-closing tag end
      const selfCloseMatch = text.slice(i).match(/^<\/>/);
      if (selfCloseMatch) {
        flushText();
        if (currentTags.length > 0) currentTags.pop();
        i += selfCloseMatch[0].length;
        continue;
      }
    }

    // Look for blackboard variables
    if (text[i] === "{") {
      const bbMatch = text.slice(i).match(/^\{([^\{\}:]+)(?::(\d+))?%?\}/);
      if (bbMatch) {
        flushText();

        const key = bbMatch[1];
        const precisionStr = bbMatch[2];
        const value = blackboard[key];

        let content = `{${key}}`;
        if (value !== undefined) {
          const isPercentage = bbMatch[0].includes("%");
          const precision = precisionStr ? parseInt(precisionStr) : 0;
          const raw = isPercentage ? value * 100 : value;

          const lastChar = text[i - 1];
          const alreadyHasPlus = lastChar === "+";
          const sign = !alreadyHasPlus
            ? raw > 0
              ? "+"
              : raw < 0
              ? "-"
              : ""
            : "";
          const formatted = Math.abs(raw).toFixed(precision);
          content = `${sign}${formatted}${isPercentage ? "%" : ""}`;
        }

        result.push(
          <span key={result.length} className="text-red-400">
            {content}
          </span>
        );

        i += bbMatch[0].length;
        continue;
      }
    }

    // Regular character - add to current text
    currentText += text[i];
    i++;
  }

  // Flush any remaining text
  flushText();

  return React.Children.toArray(result);
}

export default parseRichText;
