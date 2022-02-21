import { Button, Input, Textarea, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { SyntheticEvent, useState } from 'react'
import AuthorLink from '../../components/AuthorLink'
import Layout from '../../components/Layout'
import LoadingSpinner from '../../components/LoadingSpinner'
import TextareaAutosize from 'react-textarea-autosize'
import {
  accountSettingsRoute,
  indexRoute,
  loginRoute,
} from '../../utils/routes'
import supabase from '../../supabase/client'
import { Profile } from '@prisma/client'
import prismaClient from '../../lib/prisma'
import { GetServerSideProps } from 'next'
import { User } from '@supabase/supabase-js'
import useConfirmDialog from '../../hooks/useConfirmDialog'
import { useUser } from '../../contexts/user'
import { updateProfile } from '../../lib/apiHelpers'

interface Props {
  user: User | null
  profile: Profile | null
}

const SettingsView = ({ user, profile }: Props) => {
  const router = useRouter()
  const toast = useToast()

  const { logout } = useUser()

  const handleDelete = async () => {
    if (!user) return
    setSaving(true)
    await fetch(`/api/users/${user.id}`, { method: 'DELETE' })
    logout()
    setSaving(false)
    router.push(indexRoute)
  }

  const { ConfirmDialog, onOpen } = useConfirmDialog({
    title: 'Delete account',
    body: 'Are you sure you want to delete your account? All lessons & content will be deleted forever!',
    confirmText: 'Delete account permanently',
    onConfirmClick: handleDelete || (() => null),
  })

  const [localProfile, setProfile] = useState<Profile | null>(profile)
  const [saving, setSaving] = useState(false)
  const [profileChanged, setProfileChanged] = useState(false)

  const modifyProfile = (a: Profile) => {
    setProfileChanged(true)
    setProfile(a)
  }

  const handleSave = async (event: SyntheticEvent) => {
    event.preventDefault()
    if (!localProfile || !user) return
    setSaving(true)
    await updateProfile(user.id, localProfile)
    toast({
      status: 'success',
      title: 'Changes saved!',
    })
    setSaving(false)
  }

  const handleDeleteClick = (event: SyntheticEvent) => {
    event.preventDefault()
    onOpen()
  }

  return (
    <Layout
      title="Account settings"
      breadcrumbs={[
        {
          label: 'Account settings',
          href: accountSettingsRoute,
          as: accountSettingsRoute,
        },
      ]}
    >
      <ConfirmDialog />
      {saving && <LoadingSpinner />}
      {localProfile && (
        <>
          <div className="mb-4">
            <AuthorLink author={localProfile}></AuthorLink>
          </div>
          <section className="flex flex-col my-8">
            <div className="flex items-center justify-between">
              <h2 className="mb-4 text-xl font-bold leading-tight tracking-tighter md:text-2xl">
                Profile settings
              </h2>
              <Button
                colorScheme="black"
                className="w-fit disabled:opacity-50"
                onClick={handleSave}
                disabled={!profileChanged}
              >
                Save
              </Button>
            </div>
            <div className="my-2">
              <h3 className="font-bold leading-tight tracking-tighter">Name</h3>
              <Input
                type="text"
                size="lg"
                variant="outline"
                placeholder="Full name"
                value={localProfile.displayName || ''}
                onChange={(e) =>
                  modifyProfile({
                    ...localProfile,
                    displayName: e.target.value,
                  })
                }
              />
            </div>
            <div className="my-2">
              <h3 className="font-bold leading-tight tracking-tighter">Bio</h3>
              <Textarea
                as={TextareaAutosize}
                className="w-full mt-1 border-0 resize-none"
                placeholder="Bio"
                value={localProfile.bio || ''}
                onChange={(e) =>
                  modifyProfile({ ...localProfile, bio: e.target.value })
                }
              />
            </div>
          </section>
          {/* <section className="flex flex-col my-8">
            <h2 className="mb-4 text-xl font-bold leading-tight tracking-tighter md:text-2xl">
              Email settings
            </h2>
            <div className="my-2">
              <h3 className="font-bold leading-tight tracking-tighter">
                Email address
              </h3>
              <Input
                type="text"
                size="lg"
                variant="outline"
                placeholder="Email"
                value={profile.publicEmail || ''}
                onChange={(e) =>
                  modifyProfile({ ...profile, publicEmail: e.target.value })
                }
              />
            </div>
          </section> */}
          <section className="flex flex-col my-8">
            <h2 className="mb-4 text-xl font-bold leading-tight tracking-tighter md:text-2xl">
              Links
            </h2>
            <div className="my-2">
              <h3 className="font-bold leading-tight tracking-tighter">
                Twitter profile URL
              </h3>
              <Input
                type="text"
                size="lg"
                variant="outline"
                placeholder="Leave blank to remove from public profile."
                value={localProfile.twitterUrl || ''}
                onChange={(e) =>
                  modifyProfile({
                    ...localProfile,
                    twitterUrl: e.target.value,
                  })
                }
              />
            </div>
            <div className="my-2">
              <h3 className="font-bold leading-tight tracking-tighter">
                LinkedIn profile URL
              </h3>
              <Input
                type="text"
                size="lg"
                variant="outline"
                placeholder="Leave blank to remove from public profile."
                value={localProfile.linkedinUrl || ''}
                onChange={(e) =>
                  modifyProfile({
                    ...localProfile,
                    linkedinUrl: e.target.value,
                  })
                }
              />
            </div>
            <div className="my-2">
              <h3 className="font-bold leading-tight tracking-tighter">
                Personal website URL
              </h3>
              <Input
                type="text"
                size="lg"
                variant="outline"
                placeholder="Leave blank to remove from public profile."
                value={localProfile.personalUrl || ''}
                onChange={(e) =>
                  modifyProfile({
                    ...localProfile,
                    personalUrl: e.target.value,
                  })
                }
              />
            </div>
            <div className="my-2">
              <h3 className="font-bold leading-tight tracking-tighter">
                Public email
              </h3>
              <Input
                type="text"
                size="lg"
                variant="outline"
                placeholder="Leave blank to remove from public profile."
                value={localProfile.publicEmail || ''}
                onChange={(e) =>
                  modifyProfile({
                    ...localProfile,
                    publicEmail: e.target.value,
                  })
                }
              />
            </div>
            <div className="my-2">
              <h3 className="font-bold leading-tight tracking-tighter">
                Venmo URL
              </h3>
              <Input
                type="text"
                size="lg"
                variant="outline"
                placeholder="Leave blank to remove from public profile."
                value={localProfile.venmoUrl || ''}
                onChange={(e) =>
                  modifyProfile({
                    ...localProfile,
                    venmoUrl: e.target.value,
                  })
                }
              />
            </div>
          </section>
          <section className="my-8">
            <Button color="red" className="w-56" onClick={handleDeleteClick}>
              Delete account
            </Button>
          </section>
        </>
      )}
    </Layout>
  )
}
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { user } = await supabase.auth.api.getUserByCookie(req)
  if (!user) {
    return { props: {}, redirect: { destination: loginRoute() } }
  }

  return {
    props: {
      user,
      profile: await prismaClient.profile.findFirst({
        where: { uid: user.id },
      }),
    },
  }
}

export default SettingsView
