import {
  Button,
  chakra,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tooltip,
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
  withLabel?: boolean
}
const ListItem = ({
  href,
  as,
  label,
  icon,
  requiresLogin = false,
  withLabel = true,
}: ListItemProps) => {
  const router = useRouter()
  const isActive = router.pathname === href
  const { userAndProfile } = useUser()

  return (
    <Tooltip label={label} hasArrow placement="right">
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
            className={classNames(
              'flex !w-full gap-3 text-inherit font-bold leading-tight tracking-tighter',
              {
                '!justify-start': withLabel,
                'justify-center': !withLabel,
              }
            )}
          >
            {icon || null}
            {withLabel && label}
          </Button>
        </Link>
      </div>
    </Tooltip>
  )
}

interface AppMenuProps {
  withLabel?: boolean
}

const AppMenu = ({ withLabel = true }: AppMenuProps) => {
  const { userAndProfile: user } = useUser()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()

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
      <Tooltip label="Home" hasArrow placement="right">
        <div className="flex items-center justify-center w-full mb-4">
          <Link href={exploreRoute} passHref>
            <Button
              variant="ghost"
              className={classNames('flex items-center gap-2', {
                '!justify-start': withLabel,
                'justify-center': !withLabel,
              })}
            >
              <CuryteLogo />
              {withLabel && (
                <h2 className="text-2xl font-bold leading-tight tracking-tighter">
                  Curyte
                </h2>
              )}
            </Button>
          </Link>
        </div>
      </Tooltip>
      {withLabel && (
        <div className="mx-2">
          <InputGroup onClick={onOpen}>
            <InputLeftElement>
              <SearchIcon className="w-5 h-5 text-zinc-500" />
            </InputLeftElement>
            <Input
              placeholder="Search..."
              variant="filled"
              colorScheme="black"
              unselectable="on"
            ></Input>
          </InputGroup>
        </div>
      )}
      {!withLabel && (
        <Tooltip label="Search Curyte" hasArrow placement="right">
          <Button
            onClick={onOpen}
            variant="ghost"
            className={classNames(
              'flex !w-full gap-3 text-inherit font-bold leading-tight tracking-tighter',
              { '!justify-start': withLabel, 'justify-center': !withLabel }
            )}
          >
            <SearchIcon className="w-5 h-5 text-zinc-500" />
          </Button>
        </Tooltip>
      )}
      <ListItem
        icon={<GlobeAltIcon className="h-6 w-6 !text-inherit" />}
        label="Explore"
        withLabel={withLabel}
        as={exploreRoute}
        href={exploreRoute}
      />
      <ListItem
        icon={<CollectionIcon className="h-6 w-6 !text-inherit" />}
        label="Workspace"
        withLabel={withLabel}
        as={workspaceRoute}
        href={workspaceRoute}
        requiresLogin
      />
      <ListItem
        icon={<HomeIcon className="h-6 w-6 !text-inherit" />}
        label="Profile"
        withLabel={withLabel}
        as={accountRoute(user?.user?.id || '')}
        href={accountRouteHrefPath}
        requiresLogin
      />
      <ListItem
        icon={<CogIcon className="h-6 w-6 !text-inherit" />}
        label="Account settings"
        withLabel={withLabel}
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
          withLabel={withLabel}
          as={logOutRoute}
          href={logOutRoute}
        />
      )}
      {!user && (
        <ListItem
          icon={<LoginIcon className="h-6 w-6 !text-inherit" />}
          label="Log in to Curyte"
          withLabel={withLabel}
          as={loginRoute(router.route || exploreRoute)}
          href={loginRoute(router.route || exploreRoute)}
        />
      )}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl" autoFocus>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <span className="text-2xl font-bold leading-tight tracking-tighter">
              Search for lessons, topics, and more
            </span>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <chakra.form
              onSubmit={doSearch}
              className="flex flex-col w-auto gap-8 mb-4"
            >
              <InputGroup>
                <InputLeftElement>
                  <SearchIcon className="w-5 h-5 text-zinc-500" />
                </InputLeftElement>
                <Input
                  placeholder="Search Curyte..."
                  variant="filled"
                  colorScheme="black"
                  value={query}
                  autoFocus
                  onChange={(e) => setQuery(e.currentTarget.value)}
                ></Input>
              </InputGroup>
              <Button type="submit" colorScheme="black" className="self-end">
                Search
              </Button>
            </chakra.form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}

export const FullSidebar = () => {
  return (
    <div className="fixed w-16 h-full pt-4 pb-3">
      <AppMenu withLabel={false} />
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
