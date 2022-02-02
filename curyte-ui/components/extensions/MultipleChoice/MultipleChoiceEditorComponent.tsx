/**
 * Displays an editor for creating an interactive multiple choice component.
 */
import { MultipleChoiceAttrs, Option } from './MultipleChoiceAttrs'
import {
  Button,
  IconButton,
  Input,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react'
import TextareaAutosize from 'react-textarea-autosize'

interface EditorAttrs extends MultipleChoiceAttrs {
  onUpdate: (attrs: MultipleChoiceAttrs) => void
}

const MultipleChoiceEditorComponent = ({
  question,
  options = [],
  correctAnswer,
  onUpdate,
}: EditorAttrs) => {
  const onUpdateCorrectAnswer = (num: number) => {
    onUpdate({ question, options, correctAnswer: num })
  }
  const onUpdateOptionText = (text: string, index: number) => {
    onUpdate({
      question,
      correctAnswer,
      options: options.map((o, i) => (i === index ? { ...o, text } : o)),
    })
  }
  const onUpdateOptionExplanation = (explanation: string, index: number) => {
    onUpdate({
      question,
      correctAnswer,
      options: options.map((o, i) => (i === index ? { ...o, explanation } : o)),
    })
  }
  const onAddOption = () => {
    onUpdate({ question, correctAnswer, options: [...options, {} as Option] })
  }
  const onDeleteOption = (index: number) => {
    const newOptions = [...options]
    newOptions.splice(index, 1)
    onUpdate({ question, correctAnswer, options: newOptions })
  }
  const onUpdateQuestion = (text: string) => {
    onUpdate({
      question: text,
      correctAnswer,
      options,
    })
  }
  return (
    <>
      <TextareaAutosize
        autoFocus
        className="w-full p-4 mx-2 text-lg font-bold leading-tight tracking-tighter border-0 rounded resize-none"
        value={question}
        placeholder="Ask a question"
        onChange={(e) => onUpdateQuestion(e.target.value)}
      />
      <RadioGroup
        className="py-2"
        value={correctAnswer}
        onChange={(value) => onUpdateCorrectAnswer(Number(value))}
      >
        <Stack className="items-center gap-4">
          {options.map((o, index) => (
            <div className="flex items-center w-full gap-2" key={index}>
              <Radio value={index} colorScheme="green"></Radio>
              <div className="flex flex-col flex-1 gap-2">
                <Input
                  value={o.text}
                  variant="filled"
                  colorScheme="zinc"
                  placeholder="Add an answer"
                  onChange={(e) => onUpdateOptionText(e.target.value, index)}
                />
                <TextareaAutosize
                  value={o.explanation || ''}
                  placeholder="Add an explanation (optional)"
                  className="w-full px-4 py-2 text-sm border-0 rounded resize-none"
                  onChange={(e) =>
                    onUpdateOptionExplanation(e.target.value, index)
                  }
                />
              </div>
              <IconButton
                aria-label="Delete option"
                size="sm"
                variant="ghost"
                disabled={index === 0}
                onClick={() => onDeleteOption(index)}
              >
                <i className="text-lg ri-delete-bin-7-line text-zinc-700"></i>
              </IconButton>
            </div>
          ))}
          <Button
            aria-label="Delete option"
            size="sm"
            className="text-zinc-700"
            onClick={() => onAddOption()}
          >
            <div className="flex items-center gap-1 px-20">
              <i className="text-lg ri-add-line"></i>
              Add another option
            </div>
          </Button>
        </Stack>
      </RadioGroup>
    </>
  )
}

export default MultipleChoiceEditorComponent
