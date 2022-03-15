/* eslint-disable @next/next/no-title-in-document-head */
import {
  Button,
  chakra,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react'
import Link from 'next/link'
import CuryteLogo from '../components/CuryteLogo'
import Footer from '../components/Footer'
import { exploreRoute, successRoute } from '../utils/routes'
import Head from 'next/head'
import { SyntheticEvent, useEffect, useState } from 'react'
import { Profile } from '@prisma/client'
import TextareaAutosize from 'react-textarea-autosize'
import AuthorLink from '../components/AuthorLink'
import CuryteAvatar from '../components/Avatar'
import useImageUploadDialog from '../hooks/useImageUploadDialog'
import { useUserAndProfile } from '../contexts/user'
import LoadingSpinner from '../components/LoadingSpinner'
import { useRouter } from 'next/router'
import { updateProfile } from '../lib/apiHelpers'
import Container from '../components/Container'

const NextStepsView = () => {
  const router = useRouter()
  const { userAndProfile, loading } = useUserAndProfile()
  const [localProfile, setLocalProfile] = useState<Profile | null>(null)

  useEffect(() => {
    if (loading || !userAndProfile) return
    setLocalProfile(userAndProfile.profile)
  }, [loading, router, userAndProfile])

  const { getImageSrc } = useImageUploadDialog()

  const modifyProfile = (profile: Profile) => {
    setLocalProfile(profile)
  }

  if (loading) return <LoadingSpinner />

  const onEditImage = async () => {
    if (!localProfile) return
    const photoUrl = await getImageSrc({ title: 'Upload a profile image' })
    if (photoUrl) modifyProfile({ ...localProfile, photoUrl })
  }

  const onSubmit = async (event: SyntheticEvent) => {
    if (!userAndProfile?.user?.id || !localProfile) return
    event.preventDefault()
    await updateProfile(userAndProfile.user.id, localProfile)
    router.push(successRoute)
  }

  if (!userAndProfile || !localProfile) return null
  return (
    <>
      <Head>
        <title>Curyte: Sign up</title>
      </Head>
      <div className="flex flex-col items-center justify-center w-full min-h-screen">
        <Container className="flex items-center w-full gap-2 my-4">
          <Link href={exploreRoute} passHref>
            <h2 className="flex items-center gap-2 text-2xl font-bold leading-tight tracking-tighter">
              <CuryteLogo />
              Curyte
            </h2>
          </Link>
        </Container>
        <Container className="flex flex-col items-center justify-center flex-1 my-16">
          <section className="flex flex-row w-72 md:w-96">
            <div className="flex flex-col items-center justify-center w-full gap-4">
              <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl">
                Add your info
              </h1>
            </div>
          </section>
          <section className="flex items-center mt-8 w-72 md:w-96">
            <chakra.form
              className="flex flex-col w-full gap-4"
              onSubmit={onSubmit}
            >
              <div className="flex flex-col items-center gap-4 my-2">
                <CuryteAvatar
                  profile={localProfile}
                  className="shadow-xl shadow-zinc-900/10"
                  size="xl"
                />
                <Button
                  size="lg"
                  onClick={onEditImage}
                  variant="link"
                  className="underline"
                >
                  Change photo
                </Button>
              </div>
              <FormControl isRequired className="my-2">
                <FormLabel className="!font-bold leading-tight tracking-tighter">
                  Name
                </FormLabel>
                <Input
                  type="text"
                  size="lg"
                  variant="outline"
                  placeholder="Full name"
                  value={localProfile?.displayName || ''}
                  onChange={(e) =>
                    modifyProfile({
                      ...localProfile,
                      displayName: e.target.value,
                    })
                  }
                />
              </FormControl>
              <FormControl isRequired className="my-2">
                <FormLabel className="!font-bold leading-tight tracking-tighter">
                  Bio
                </FormLabel>
                <Textarea
                  size="lg"
                  as={TextareaAutosize}
                  className="w-full mt-1 border-0 resize-none"
                  placeholder="Bio"
                  value={localProfile?.bio || ''}
                  onChange={(e) =>
                    modifyProfile({ ...localProfile, bio: e.target.value })
                  }
                />
              </FormControl>
              <div className="flex flex-col gap-2 my-8">
                <span className="text-sm text-zinc-500">
                  This is how you will appear to other Curyte users.
                </span>
                <AuthorLink author={localProfile} />
              </div>
              <Button
                type="submit"
                colorScheme="black"
                size="lg"
                className="justify-center w-full"
              >
                Continue
              </Button>
            </chakra.form>
          </section>
        </Container>
        <Footer />
      </div>
    </>
  )
}

export default NextStepsView
