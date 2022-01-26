import {
  useDisclosure,
  MenuButton,
  MenuList,
  Button,
  Menu,
  MenuItem,
  MenuOptionGroup,
  Portal,
} from '@chakra-ui/react'
import { SupportIcon, QuestionMarkCircleIcon } from '@heroicons/react/outline'
import classNames from 'classnames'

const EditorHelpMenu = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Menu isOpen={isOpen}>
      <MenuButton
        py={1}
        px={1}
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
        className={classNames('text-zinc-300 hover:text-zinc-700', {
          'text-zinc-700': isOpen,
        })}
      >
        <QuestionMarkCircleIcon className="w-6 h-6" />
      </MenuButton>
      <Portal>
        <MenuList onMouseEnter={onOpen} onMouseLeave={onClose}>
          <MenuOptionGroup
            title="Resources"
            className="uppercase text-zinc-700"
          >
            <MenuItem className="hover:underline">
              <a
                href="https://www.curyte.com/lessons/aa19daf3-3399-40db-bfda-be3c7f64f083"
                target="_blank"
                rel="noreferrer"
              >
                Getting started with Curyte
              </a>
            </MenuItem>
            <MenuItem className="hover:underline">
              <a
                href="http://curyte.com/lessons/writing-a-lesson-on-curyte-1639450877617"
                target="_blank"
                rel="noreferrer"
              >
                Writing your first lesson
              </a>
            </MenuItem>
            <MenuItem className="hover:underline">
              <a
                href="http://curyte.com/lessons/writing-a-lesson-on-curyte-1639450877617"
                target="_blank"
                rel="noreferrer"
              >
                The 5E Method
              </a>
            </MenuItem>
            <MenuItem className="hover:underline">
              <a
                href="http://curyte.com/lessons/8e7265ed-5aba-4283-939a-cd3c20bbdf5d"
                target="_blank"
                rel="noreferrer"
              >
                Adding embedded content
              </a>
            </MenuItem>
          </MenuOptionGroup>
          <MenuItem>
            <a
              target="_blank"
              href="https://discord.gg/Axd7QgGYF9"
              rel="noreferrer"
            >
              <Button className="flex items-center gap-1" size="sm">
                Get help
                <SupportIcon className="w-4 h-4" />
              </Button>
            </a>
          </MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  )
}

export default EditorHelpMenu
