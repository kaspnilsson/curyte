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

interface EditorAttrs extends MultipleChoiceAttrs {
  onUpdate: (attrs: MultipleChoiceAttrs) => void
}
import TextareaAutosize from 'react-textarea-autosize'

const MultipleChoiceEditorComponent = ({
  question,
  options,
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
        value={question}
        className="border-0 font-bold tracking-tight leading-tight resize-none rounded text-lg w-full p-4 mx-2"
        placeholder="Ask a question"
        onChange={(e) => onUpdateQuestion(e.target.value)}
      />
      <RadioGroup
        className="py-2"
        value={correctAnswer}
        onChange={(value) => onUpdateCorrectAnswer(Number(value))}
      >
        <Stack className="gap-4 items-center">
          {options.map((o, index) => (
            <div className="flex gap-2 items-center w-full" key={index}>
              <Radio value={index} colorScheme="green"></Radio>
              <div className="flex-1 gap-2 flex flex-col">
                <Input
                  value={o.text}
                  variant="filled"
                  colorScheme="purple"
                  placeholder="Add an answer"
                  onChange={(e) => onUpdateOptionText(e.target.value, index)}
                />
                <TextareaAutosize
                  value={o.explanation || ''}
                  placeholder="Add an explanation (optional)"
                  className="text-sm border-0 w-full px-4 py-2 rounded resize-none"
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
                <i className="ri-delete-bin-7-line text-gray-700 text-lg"></i>
              </IconButton>
            </div>
          ))}
          <Button
            aria-label="Delete option"
            size="sm"
            className="text-gray-700"
            onClick={() => onAddOption()}
          >
            <div className="flex px-20 items-center gap-1">
              <i className="ri-add-line text-lg"></i>
              Add another option
            </div>
          </Button>
        </Stack>
      </RadioGroup>
    </>
  )
}

export default MultipleChoiceEditorComponent
