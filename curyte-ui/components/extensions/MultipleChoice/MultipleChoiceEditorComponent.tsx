/**
 * Displays an editor for creating an interactive multiple choice component.
 */
import { MultipleChoiceAttrs } from './MultipleChoiceAttrs'
import { Radio, RadioGroup, Stack } from '@chakra-ui/react'

interface EditorAttrs extends MultipleChoiceAttrs {
  onUpdate: (attrs: MultipleChoiceAttrs) => void
}

const MultipleChoiceEditorComponent = ({
  options,
  correctAnswer,
  onUpdate,
}: EditorAttrs) => {
  const onUpdateCorrectAnswer = (num: number) => {
    onUpdate({ options, correctAnswer: num })
  }
  return (
    <RadioGroup>
      <Stack>
        {options.map((o, index) => (
          <Radio
            key={index}
            value={index}
            isChecked={index === correctAnswer}
            onChange={() => onUpdateCorrectAnswer(index)}
          >
            {o.text}
          </Radio>
        ))}
      </Stack>
    </RadioGroup>
  )
}

export default MultipleChoiceEditorComponent
