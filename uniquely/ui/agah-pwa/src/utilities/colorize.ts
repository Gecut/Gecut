import {random} from '@alwatr/math';

const colors = [
  'var(--ref-palette-neutral-variant20)',
  'var(--ref-palette-neutral-variant30)',
] as const;
const memory: Record<string, (typeof colors)[number]> = {};
let lastColor = ';';

export function generateColorFromString(str: string): (typeof colors)[number] {
  if (memory[str] == null) {
    memory[str] = generateColor();
  }

  return memory[str];
}

function generateColor(): (typeof colors)[number] {
  const color = random.shuffle(colors as unknown as string[])[
    random.integer(0, colors.length - 1)
  ] as (typeof colors)[number];

  if (color === lastColor) {
    return generateColor();
  }

  lastColor = color;

  return color;
}
