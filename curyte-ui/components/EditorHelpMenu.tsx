import {
  MenuButton,
  MenuList,
  Button,
  Menu,
  MenuItem,
  MenuOptionGroup,
  MenuDivider,
} from '@chakra-ui/react'
import { SupportIcon, QuestionMarkCircleIcon } from '@heroicons/react/outline'
import { discordInviteHref } from '../utils/routes'

interface Props {
  showHints?: () => void
}

const EditorHelpMenu = ({ showHints }: Props) => {
  return (
    <Menu placement="top" isLazy>
      <MenuButton className="p-2 text-zinc-900">
        <div className="flex items-center gap-1 font-bold leading-tight tracking-tighter">
          <QuestionMarkCircleIcon className="w-6 h-6" />
        </div>
      </MenuButton>
      <MenuList>
        <MenuOptionGroup
          title="Resources"
          className="uppercase text-zinc-700 !mb-0"
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
              href="http://curyte.com/lessons/4Jhyh_peR2IJyLo8"
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
          <MenuItem className="hover:underline">
            <a
              href="http://curyte.com/lessons/WxzMiQtgkuigQeM7"
              target="_blank"
              rel="noreferrer"
            >
              Curriculum and copyright
            </a>
          </MenuItem>
        </MenuOptionGroup>
        <MenuDivider />
        <MenuOptionGroup title="Help" className="uppercase text-zinc-700 !mb-0">
          {showHints && (
            <MenuItem className="hover:underline" onClick={showHints}>
              Show editor hints
            </MenuItem>
          )}
          <a
            target="_blank"
            href={discordInviteHref}
            rel="noreferrer"
            className=""
          >
            <Button className="flex items-center gap-1 mx-3 my-2" size="sm">
              Get support
              <SupportIcon className="w-4 h-4" />
            </Button>
          </a>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  )
}

export default EditorHelpMenu
