import {
  MenuButton,
  Button,
  Portal,
  Menu,
  MenuList,
  useToast,
} from '@chakra-ui/react'
import { Editor } from '@tiptap/react'
import { where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { getLessons } from '../firebase/api'
import useConfirmDialog from '../hooks/useConfirmDialog'
import { Lesson } from '../interfaces/lesson'
import MenuItem from './MenuItem'

interface Props {
  editor: Editor | null
}

const TemplatesMenu = ({ editor }: Props) => {
  const [templates, setTemplates] = useState<Lesson[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<Lesson | null>(null)
  const toast = useToast()
  useEffect(() => {
    const getTemplates = async () => {
      const fetched = await getLessons(
        [where('template', '==', true), where('private', '==', false)],
        true
      )
      setTemplates(fetched)
    }
    getTemplates()
  }, [])

  const applyTemplate = () => {
    if (!editor || !selectedTemplate) return
    editor.commands.setContent(selectedTemplate.content)
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
      {templates.length ? (
        <Menu
          id="templates-menu"
          isLazy
          boundary="scrollParent"
          colorScheme="zinc"
        >
          <MenuButton size="sm" as={Button}>
            <div className="flex items-center gap-1 text-sm text-zinc-900">
              Templates
              <i className="w-2 text-lg ri-arrow-drop-down-line"></i>
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
      ) : null}
      <ConfirmDialog />
    </>
  )
}

export default TemplatesMenu
