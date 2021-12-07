import * as chakra from '@chakra-ui/react'
interface Props {
  onClick: () => void
  icon?: React.ReactNode
  label: string
  shortcut?: React.ReactNode
  disabled?: boolean
}

const MenuItem = ({ onClick, icon, label, shortcut, disabled }: Props) => {
  return (
    <chakra.MenuItem
      className="flex items-center gap-2 justify-items-start"
      onClick={onClick}
      disabled={disabled}
    >
      {icon || null}
      {label}
      <div className="flex-end">{shortcut || null}</div>
    </chakra.MenuItem>
  )
}

export default MenuItem
