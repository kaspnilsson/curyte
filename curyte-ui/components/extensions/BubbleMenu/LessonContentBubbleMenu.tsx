import React from 'react'
import { BubbleMenu, Editor, isTextSelection } from '@tiptap/react'
import MenuIconButton from '../../MenuIconButton'
import 'tippy.js/dist/svg-arrow.css'
// No types available for react-speech-kit
// eslint-disable-next-line
// @ts-ignore
import { useSpeechSynthesis } from 'react-speech-kit'
import { Button } from '@chakra-ui/react'
import { TextSelection } from 'prosemirror-state'

interface Props {
  editor: Editor
}

const expandSelectionToFullWords = (editor: Editor) => {
  const { selection, doc } = editor.state
  let i = 0,
    j = 0,
    text = doc.textBetween(selection.from, selection.to, ' ')
  while (!text.startsWith(' ') || !text.endsWith(' ')) {
    if (selection.from - i - 1 >= 0 && !text.startsWith(' ')) {
      i++
    }
    if (selection.to + j + 1 < doc.content.size && !text.endsWith(' ')) {
      j++
    }
    text = doc.textBetween(selection.from - i, selection.to + j, ' ')
  }

  const tr = editor.state.tr.setSelection(
    TextSelection.between(
      doc.resolve(selection.from - i),
      doc.resolve(selection.to + j)
    )
  )
  editor.view.dispatch(tr)
}

const LessonContentBubbleMenu = ({ editor }: Props) => {
  const { speak, speaking, cancel } = useSpeechSynthesis()

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 flex justify-center">
        {!!speaking && (
          <Button
            colorScheme="black"
            className="z-10 flex items-center self-center gap-1 !drop-shadow-2xl m-3"
            onClick={cancel}
          >
            Stop speaking
            <i className="text-lg font-thin ri-volume-mute-fill"></i>
          </Button>
        )}
      </div>
      <BubbleMenu
        editor={editor}
        tippyOptions={{
          duration: 200,
          animation: 'shift-away',
          zIndex: 1000,
        }}
        shouldShow={({ editor }) =>
          !editor.view.state.selection.empty &&
          isTextSelection(editor.view.state.selection)
        }
        className="relative flex items-center gap-1 p-1 overflow-hidden bg-white rounded shadow"
      >
        <MenuIconButton
          label="Hear it"
          onClick={() => {
            expandSelectionToFullWords(editor)
            const { state } = editor
            const { from, to } = state.selection
            const text = state.doc.textBetween(from, to, ' ')
            speak({ text })
          }}
          icon={<i className="text-lg font-thin ri-volume-up-fill" />}
        />
        {/* <MenuIconButton
        label="Summarize"
        onClick={() => {
          console.log('TODO')
          // Should only render when a lot of text is selected
        }}
        icon={<i className="text-lg font-thin ri-file-text-fill" />}
      /> */}
        {/* <MenuIconButton
          label="Define"
          onClick={() => {
            console.log('TODO')
            // Should only render when one single word (or maybe phrase?) is selected
            // Could also show synonyms
          }}
          icon={<i className="text-lg font-thin ri-file-text-fill" />}
        /> */}
        {/* <MenuIconButton
          label="Translate"
          onClick={() => {
            console.log('TODO')
          }}
          icon={<i className="text-lg font-thin ri-translate-2" />}
        /> */}
      </BubbleMenu>
    </>
  )
}

export default LessonContentBubbleMenu
