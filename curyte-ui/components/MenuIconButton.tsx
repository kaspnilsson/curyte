import * as chakra from '@chakra-ui/react'
interface Props {
  onClick: () => void
  icon: React.ReactNode
  label: string
  isActive?: boolean
  disabled?: boolean
  shortcut?: React.ReactNode
}

const MenuIconButton = ({
  onClick,
  icon,
  label,
  isActive,
  disabled,
  shortcut,
}: Props) => {
  return (
    <chakra.Tooltip
      hasArrow
      label={
        <div className="flex items-center gap-1">
          {label}
          {shortcut || null}
        </div>
      }
    >
      <chakra.IconButton
        size="sm"
        variant="ghost"
        colorScheme="zinc"
        aria-label={label}
        onClick={onClick}
        isActive={isActive}
        disabled={disabled}
      >
        <span className="text-zinc-900">{icon}</span>
      </chakra.IconButton>
    </chakra.Tooltip>
  )
}

export default MenuIconButton
