import classNames from 'classnames'
import { Color, COLORS } from '../utils/color'
import MenuIconButton from './MenuIconButton'
import { BanIcon } from '@heroicons/react/outline'

const toTitleCase = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1)

interface Props {
  currentColor: Color
  onChange: (c: Color) => void
  exclude?: Color[]
}

const ColorOptions = ({ currentColor, onChange, exclude = [] }: Props) => {
  return (
    <>
      {COLORS.filter((c) => !exclude.includes(c)).map((c) => (
        <MenuIconButton
          key={c}
          onClick={() => onChange(c)}
          icon={
            <div
              className={classNames('overflow-hidden p-2 border rounded-full', {
                'bg-red-50': c === 'red',
                'bg-yellow-50': c === 'yellow',
                'bg-green-50': c === 'green',
                'bg-blue-50': c === 'blue',
                'bg-blue-50': c === 'blue',
                'bg-zinc-50': c === 'gray',
                'bg-transparent': c === 'transparent',
              })}
            >
              {c === 'transparent' && (
                <BanIcon className="w-5 h-5 -m-2 text-red-200" />
              )}
            </div>
          }
          label={toTitleCase(c)}
          isActive={currentColor === c}
        />
      ))}
    </>
  )
}

export default ColorOptions
