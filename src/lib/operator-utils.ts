export interface Operator {
  name: string;
  tags: string[];
  image: string;
  stars: number;
}

export function getCombinations(tags: string[]): string[][] {
  const results: string[][] = [];
  const backtrack = (start: number, path: string[]) => {
    if (path.length > 0) results.push([...path]);
    for (let i = start; i < tags.length; i++) {
      path.push(tags[i]);
      backtrack(i + 1, path);
      path.pop();
    }
  };
  backtrack(0, []);
  return results;
}

export function getMatchingTagGroups(
  operators: Operator[],
  selectedTags: string[]
): Record<string, Operator[]> {
  const groups: Record<string, Operator[]> = {};

  const tagCombos = getCombinations(selectedTags);

  tagCombos.forEach((combo) => {
    const comboKey = combo.sort().join(" + ");

    // Rule 1: combo ต้องเป็น subset ของ selectedTags
    if (!combo.every((tag) => selectedTags.includes(tag))) {
      return;
    }

    // Rule 2: ถ้า selectedTags มี Top Operator
    // → ถ้า combo มี ≥ 2 tags → ต้องมี Top Operator
    if (
      selectedTags.includes("Top Operator") &&
      combo.length >= 2 &&
      !combo.includes("Top Operator")
    ) {
      return;
    }

    const matched = operators.filter((op) => {
      // Rule 3: 6 ดาว → ต้องมี Top Operator
      if (op.stars >= 6 && !selectedTags.includes("Top Operator")) {
        return false;
      }

      return combo.every((tag) => op.tags.includes(tag));
    });

    if (matched.length > 0) {
      groups[comboKey] = matched;
    }
  });

  return groups;
}
