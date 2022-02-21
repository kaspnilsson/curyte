import {
  Button,
  chakra,
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
import { SyntheticEvent, useEffect, useRef, useState } from 'react'
import { useUser } from '../contexts/user'
import {
  accountRoute,
  accountRouteHrefPath,
  accountSettingsRoute,
  exploreRoute,
  loginRoute,
  logOutRoute,
  searchRoute,
  workspaceRoute,
} from '../utils/routes'
import CuryteLogo from './CuryteLogo'

interface ListItemProps {
  href: string
  as: string
  label: string
  icon?: React.ReactNode
  requiresLogin?: boolean
}
const ListItem = ({
  href,
  as,
  label,
  icon,
  requiresLogin = false,
}: ListItemProps) => {
  const router = useRouter()
  const isActive = router.pathname === href
  const { userAndProfile } = useUser()

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
      <Link
        href={requiresLogin && !userAndProfile ? loginRoute() : href}
        passHref
        as={requiresLogin && !userAndProfile ? loginRoute() : as}
      >
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
  const { userAndProfile: user } = useUser()
  const router = useRouter()
  const [query, setQuery] = useState('')

  const doSearch = (event: SyntheticEvent) => {
    event.preventDefault()
    if (!query) return
    router.push(searchRoute(query))
  }

  useEffect(() => {
    if (router.query['q']) {
      setQuery(router.query['q'] as string)
    }
  }, [router])

  return (
    <div className="flex flex-col h-full gap-2">
      <Link href={exploreRoute} passHref>
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
      <chakra.form onSubmit={doSearch} className="w-auto mx-4 mb-4">
        <InputGroup>
          <InputLeftElement>
            <SearchIcon className="w-5 h-5 text-zinc-500" />
          </InputLeftElement>
          <Input
            placeholder="Search..."
            variant="filled"
            colorScheme="black"
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
          ></Input>
        </InputGroup>
      </chakra.form>
      <ListItem
        icon={<GlobeAltIcon className="h-6 w-6 !text-inherit" />}
        label="Explore"
        as={exploreRoute}
        href={exploreRoute}
      />
      <ListItem
        icon={<CollectionIcon className="h-6 w-6 !text-inherit" />}
        label="Workspace"
        as={workspaceRoute}
        href={workspaceRoute}
        requiresLogin
      />
      <ListItem
        icon={<HomeIcon className="h-6 w-6 !text-inherit" />}
        label="Profile"
        as={accountRoute(user?.user?.id || '')}
        href={accountRouteHrefPath}
        requiresLogin
      />
      <ListItem
        icon={<CogIcon className="h-6 w-6 !text-inherit" />}
        label="Account settings"
        as={accountSettingsRoute}
        href={accountSettingsRoute}
        requiresLogin
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
          as={loginRoute(router.route || exploreRoute)}
          href={loginRoute(router.route || exploreRoute)}
        />
      )}
    </div>
  )
}

export const FullSidebar = () => {
  return (
    <div className="fixed w-48 h-full pt-4 pb-3 xl:w-64">
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
