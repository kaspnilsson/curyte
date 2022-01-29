import {
  Button,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Input,
  InputGroup,
  InputLeftElement,
  useDisclosure,
} from '@chakra-ui/react'
import {
  CogIcon,
  CollectionIcon,
  GlobeAltIcon,
  HomeIcon,
  LoginIcon,
  LogoutIcon,
  MenuIcon,
  SearchIcon,
} from '@heroicons/react/outline'
import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRef } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase/clientApp'
import {
  accountRoute,
  accountRouteHrefPath,
  accountSettingsRoute,
  lessonSearchRoute,
  loginRoute,
  logOutRoute,
  workspaceRoute,
} from '../utils/routes'
import CuryteLogo from './CuryteLogo'
import LessonSearchModal from './LessonSearchModal'

interface ListItemProps {
  href: string
  as: string
  label: string
  icon?: React.ReactNode
}
const ListItem = ({ href, as, label, icon }: ListItemProps) => {
  const router = useRouter()
  const isActive = router.pathname === href
  return (
    <div
      className={classNames('relative flex', {
        'text-zinc-500': !isActive,
        'text-zinc-900': isActive,
      })}
    >
      {isActive && (
        <div className="z-10 w-1 h-6 my-auto -mr-1 rounded-r-full bg-zinc-900"></div>
      )}
      <Link href={href} passHref as={as}>
        <Button
          variant="ghost"
          className="flex !justify-start !w-full gap-3 text-inherit font-bold leading-tight tracking-tighter"
        >
          {icon || null}
          {label}
        </Button>
      </Link>
    </div>
  )
}

const AppMenu = () => {
  const [user, userLoading] = useAuthState(auth)
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  if (userLoading) return null
  return (
    <div className="flex flex-col h-full gap-2">
      <Link href={lessonSearchRoute()} passHref>
        <Button
          variant="ghost"
          className="flex items-center gap-2 !justify-start mb-4"
        >
          <CuryteLogo />
          <h2 className="text-2xl font-bold leading-tight tracking-tighter">
            Curyte
          </h2>
        </Button>
      </Link>
      <div className="w-56 mx-4 mb-4" onClick={onOpen}>
        <InputGroup>
          <InputLeftElement>
            <SearchIcon className="w-5 h-5 text-zinc-500" />
          </InputLeftElement>
          <Input
            isReadOnly
            placeholder="Search..."
            variant="filled"
            colorScheme="black"
          ></Input>
        </InputGroup>
      </div>
      <ListItem
        icon={<GlobeAltIcon className="h-6 w-6 !text-inherit" />}
        label="Explore"
        as={lessonSearchRoute()}
        href={lessonSearchRoute()}
      />
      <ListItem
        icon={<CollectionIcon className="h-6 w-6 !text-inherit" />}
        label="Workspace"
        as={user ? workspaceRoute : loginRoute()}
        href={workspaceRoute}
      />
      <ListItem
        icon={<HomeIcon className="h-6 w-6 !text-inherit" />}
        label="Profile"
        as={user ? accountRoute(user.uid) : loginRoute()}
        href={accountRouteHrefPath}
      />
      <ListItem
        icon={<CogIcon className="h-6 w-6 !text-inherit" />}
        label="Account settings"
        as={user ? accountSettingsRoute : loginRoute()}
        href={accountSettingsRoute}
      />
      {/* empty div acts as spacer to put content at bottom */}
      <div className="flex-1" />
      {user && (
        <ListItem
          icon={<LogoutIcon className="h-6 w-6 !text-inherit" />}
          label="Log out of Curyte"
          as={logOutRoute}
          href={logOutRoute}
        />
      )}
      {!user && (
        <ListItem
          icon={<LoginIcon className="h-6 w-6 !text-inherit" />}
          label="Log in to Curyte"
          as={loginRoute(router.route || lessonSearchRoute())}
          href={loginRoute(router.route || lessonSearchRoute())}
        />
      )}
      <LessonSearchModal isOpen={isOpen} onClose={onClose} />
    </div>
  )
}

export const FullSidebar = () => {
  return (
    <div className="fixed w-64 h-full py-4">
      <AppMenu />
    </div>
  )
}

export const MobileSidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const buttonRef = useRef(null)

  return (
    <>
      <Button
        ref={buttonRef}
        onClick={onOpen}
        isActive={isOpen}
        variant="ghost"
        className="-ml-4"
      >
        <MenuIcon className="w-6 h-6" />
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={buttonRef}
      >
        <DrawerOverlay />
        <DrawerContent className="py-4 max-w-56">
          <AppMenu />
        </DrawerContent>
      </Drawer>
    </>
  )
}