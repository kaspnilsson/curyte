import {
  MenuButton,
  Button,
  Portal,
  Menu,
  MenuList,
  useToast,
  Spinner,
} from '@chakra-ui/react'
import { Lesson } from '@prisma/client'
import { Editor, JSONContent } from '@tiptap/react'
import { useEffect, useState } from 'react'
import useConfirmDialog from '../hooks/useConfirmDialog'
import { getLessons } from '../lib/apiHelpers'
import MenuItem from './MenuItem'

interface Props {
  editor: Editor | null
}

const TemplatesMenu = ({ editor }: Props) => {
  const [templates, setTemplates] = useState<Lesson[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<Lesson | null>(null)
  const toast = useToast()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getTemplates = async () => {
      setLoading(true)
      setTemplates(await getLessons({ where: { template: true } }))
      setLoading(false)
    }
    getTemplates()
  }, [])

  const applyTemplate = () => {
    if (!editor || !selectedTemplate || !selectedTemplate.content) return
    editor.commands.setContent(selectedTemplate.content as JSONContent)
    setSelectedTemplate(null)
    toast({ title: 'Template applied!', status: 'success' })
  }

  const { ConfirmDialog, onOpen } = useConfirmDialog({
    title: 'Use template',
    body: "Using this template will clear your lesson's content. Are you sure you want to use this template?",
    confirmText: 'Use template',
    onConfirmClick: applyTemplate,
  })

  const onSelectTemplate = (t: Lesson) => {
    setSelectedTemplate(t)
    onOpen()
  }

  return (
    <>
      <Menu id="templates-menu" isLazy boundary="scrollParent">
        <MenuButton
          size="sm"
          as={Button}
          disabled={loading || !templates.length}
          colorScheme="black"
        >
          <div className="flex items-center gap-1 text-sm">
            Templates
            {!loading && (
              <i className="w-2 text-lg font-thin ri-arrow-drop-down-line"></i>
            )}
            {loading && <Spinner size="xs" />}
          </div>
        </MenuButton>
        <Portal>
          <MenuList className="z-20 overflow-auto max-h-96">
            {templates.map((t, index) => (
              <MenuItem
                key={index}
                onClick={() => onSelectTemplate(t)}
                label={t.title || '(no title)'}
                description={t.description || ''}
              />
            ))}
          </MenuList>
        </Portal>
      </Menu>
      <ConfirmDialog />
    </>
  )
}

export default TemplatesMenu
