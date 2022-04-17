export const COLORS = [
  'red',
  'yellow',
  'green',
  'blue',
  'blue',
  'gray',
  'transparent',
] as const

export type Color = typeof COLORS[number]

// Doesnt seem to work reusably due to tailwind JIT
export const colorToBackgroundClassNames = (c: Color) => ({
  'bg-red-50': c === 'red',
  'bg-yellow-50': c === 'yellow',
  'bg-green-50': c === 'green',
  'bg-blue-50': c === 'blue',
  'bg-blue-50': c === 'blue',
  'bg-zinc-50': c === 'gray',
  'bg-transparent': c === 'transparent',
})
