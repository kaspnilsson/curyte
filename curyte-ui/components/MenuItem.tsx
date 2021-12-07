import * as chakra from '@chakra-ui/react'
interface Props {
  onClick: () => void
  icon?: React.ReactNode
  label: string
  shortcut?: React.ReactNode
  isActive?: boolean
  disabled?: boolean
}

const MenuItem = ({
  onClick,
  icon,
  label,
  shortcut,
  isActive,
  disabled,
}: Props) => {
  return (
    <chakra.MenuItem onClick={onClick} disabled={disabled} isActive={isActive}>
      <div className="flex items-center gap-4">
        {icon || null}
        {label}
        <div className="flex-end">{shortcut || null}</div>
      </div>
    </chakra.MenuItem>
  )
}

export default MenuItem
