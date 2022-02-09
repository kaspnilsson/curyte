import { Button, Input, Textarea } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { SyntheticEvent, useEffect, useState } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { useAuthState } from 'react-firebase-hooks/auth'
import AuthorLink from '../../components/AuthorLink'
import Layout from '../../components/Layout'
import LoadingSpinner from '../../components/LoadingSpinner'
import TextareaAutosize from 'react-textarea-autosize'
import { getAuthor, updateAuthor } from '../../firebase/api'
import { auth } from '../../firebase/clientApp'
import { Author } from '../../interfaces/author'
import { accountSettingsRoute, indexRoute } from '../../utils/routes'

const SettingsView = () => {
  const router = useRouter()
  const handleError = useErrorHandler()

  const [user, userLoading] = useAuthState(auth)
  const [loading, setLoading] = useState(userLoading)
  const [author, setAuthor] = useState<Author | null>(null)
  const [saving, setSaving] = useState(false)
  const [authorChanged, setAuthorChanged] = useState(false)

  useEffect(() => {
    if (user && !author) {
      setLoading(true)
      const fetchAuthor = async () => {
        await getAuthor(user.uid)
          .then((author) => {
            setAuthor(author)
          })
          .catch(handleError)
      }

      fetchAuthor().then(() => setLoading(false))
    }
  }, [author, handleError, user])

  const modifyAuthor = (a: Author) => {
    setAuthorChanged(true)
    setAuthor(a)
  }
  const handleSave = async (event: SyntheticEvent) => {
    event.preventDefault()
    if (!author) return
    setSaving(true)
    await updateAuthor(author)
    setSaving(false)
  }

  const handleDelete = async (event: SyntheticEvent) => {
    event.preventDefault()
    setSaving(true)
    await auth.currentUser?.delete()
    setSaving(false)
    router.push(indexRoute)
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
      {loading && <LoadingSpinner />}
      {saving && <LoadingSpinner />}
      {author && !loading && (
        <>
          <div className="mb-4">
            <AuthorLink author={author}></AuthorLink>
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
                disabled={!authorChanged}
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
                value={author.displayName}
                onChange={(e) =>
                  modifyAuthor({
                    ...author,
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
                value={author.bio}
                onChange={(e) =>
                  modifyAuthor({ ...author, bio: e.target.value })
                }
              />
            </div>
          </section>
          <section className="flex flex-col my-8">
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
                value={author.email}
                onChange={(e) =>
                  modifyAuthor({ ...author, email: e.target.value })
                }
              />
            </div>
          </section>
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
                value={author.links?.twitter || ''}
                onChange={(e) =>
                  modifyAuthor({
                    ...author,
                    links: { ...author.links, twitter: e.target.value },
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
                value={author.links?.linkedin || ''}
                onChange={(e) =>
                  modifyAuthor({
                    ...author,
                    links: {
                      ...author.links,
                      linkedin: e.target.value,
                    },
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
                value={author.links?.personalSite || ''}
                onChange={(e) =>
                  modifyAuthor({
                    ...author,
                    links: {
                      ...author.links,
                      personalSite: e.target.value,
                    },
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
                value={author.links?.publicEmail || ''}
                onChange={(e) =>
                  modifyAuthor({
                    ...author,
                    links: {
                      ...author.links,
                      publicEmail: e.target.value,
                    },
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
                value={author.links?.venmo || ''}
                onChange={(e) =>
                  modifyAuthor({
                    ...author,
                    links: {
                      ...author.links,
                      venmo: e.target.value,
                    },
                  })
                }
              />
            </div>
          </section>
          <section className="my-8">
            <Button color="red" className="w-56" onClick={handleDelete}>
              Delete account
            </Button>
          </section>
        </>
      )}
    </Layout>
  )
}
export default SettingsView
