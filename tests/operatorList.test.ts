import { describe, it, expect } from 'vitest';
import { getCombinations, getMatchingTagGroups, Operator } from '../src/lib/operator-utils';

describe('getCombinations', () => {
  it('returns all unique tag combinations', () => {
    const tags = ['A', 'B', 'C'];
    const combos = getCombinations(tags).map(c => c.sort().join(','));
    const expected = [
      'A',
      'A,B',
      'A,B,C',
      'A,C',
      'B',
      'B,C',
      'C'
    ];
    expect(new Set(combos)).toEqual(new Set(expected));
  });
});

describe('getMatchingTagGroups', () => {
  it('groups operators correctly based on selected tags', () => {
    const operators: Operator[] = [
      { name: 'Op1', tags: ['Guard', 'DPS'] },
      { name: 'Op2', tags: ['Guard', 'Healing'] },
      { name: 'Op3', tags: ['Support', 'Healing'] }
    ];

    const groups = getMatchingTagGroups(operators, ['Guard', 'Healing']);

    expect(Object.keys(groups).sort()).toEqual(['Guard', 'Guard + Healing', 'Healing'].sort());
    expect(groups['Guard'].map(o => o.name)).toEqual(['Op1', 'Op2']);
    expect(groups['Guard + Healing'].map(o => o.name)).toEqual(['Op2']);
    expect(groups['Healing'].map(o => o.name)).toEqual(['Op2', 'Op3']);
  });
});
