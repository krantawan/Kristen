export interface Operator {
  name: string;
  tags: string[];
  image?: string;
  stars?: number;
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
    const matched = operators.filter((op) =>
      combo.every((tag) => op.tags.includes(tag))
    );
    if (matched.length > 0) {
      groups[comboKey] = matched;
    }
  });

  return groups;
}
