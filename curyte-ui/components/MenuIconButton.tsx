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
        <div className="flex gap-1 items-center">
          {label}
          {shortcut || null}
        </div>
      }
    >
      <chakra.IconButton
        size="sm"
        variant="ghost"
        colorScheme="purple"
        aria-label={label}
        onClick={onClick}
        isActive={isActive}
        disabled={disabled}
      >
        {icon}
      </chakra.IconButton>
    </chakra.Tooltip>
  )
}

export default MenuIconButton
