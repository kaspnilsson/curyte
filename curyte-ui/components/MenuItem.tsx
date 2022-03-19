import { Text, MenuItem as ChakraMenuItem } from '@chakra-ui/react'
import classNames from 'classnames'
interface Props {
  onClick: () => void
  icon?: React.ReactNode
  label: string
  description: string
  shortcut?: React.ReactNode
  disabled?: boolean
  isActive?: boolean
}

const MenuItem = ({
  onClick,
  icon,
  label,
  shortcut,
  isActive,
  disabled,
  description,
}: Props) => (
  <ChakraMenuItem
    className={classNames(
      'flex items-start gap-3 justify-items-center max-w-sm',
      {
        'bg-zinc-200': isActive,
      }
    )}
    onClick={onClick}
    disabled={disabled}
  >
    {icon || null}
    <div className="flex flex-col justify-center gap-1 my-1">
      <div className="flex space-between">
        <span className="font-bold leading-tight tracking-tighter">
          {label}
        </span>
        <div className="flex-end">{shortcut || null}</div>
      </div>
      <Text fontSize="xs" className="text-zinc-500">
        {description}
      </Text>
    </div>
  </ChakraMenuItem>
)

export default MenuItem
