import * as chakra from '@chakra-ui/react'
interface Props {
  onClick: () => void
  icon?: React.ReactNode
  label: string
  description: string
  shortcut?: React.ReactNode
  disabled?: boolean
}

const MenuItem = ({
  onClick,
  icon,
  label,
  shortcut,
  disabled,
  description,
}: Props) => {
  return (
    <chakra.MenuItem
      className="flex items-start gap-3 justify-items-center"
      onClick={onClick}
      disabled={disabled}
    >
      {icon || null}
      <div className="flex flex-col justify-center">
        <div className="flex space-between">
          <chakra.Heading fontSize="sm">{label}</chakra.Heading>
          <div className="flex-end">{shortcut || null}</div>
        </div>
        <chakra.Text fontSize="xs" className="text-slate-500">
          {description}
        </chakra.Text>
      </div>
    </chakra.MenuItem>
  )
}

export default MenuItem
