/**
 * Displays an interactive multiple choice component.
 */

import { MultipleChoiceAttrs } from './MultipleChoiceAttrs'
import { Portal, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { Confetti } from '../../Confetti'

const MultipleChoiceComponent = ({
  options,
  question,
  correctAnswer,
}: MultipleChoiceAttrs) => {
  const [isFiringConfetti, setIsFiringConfetti] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const selectedOption = selectedIndex === null ? null : options[selectedIndex]

  useEffect(() => {
    setSelectedIndex(null)
  }, [options, question, correctAnswer])

  const setAnswer = (value: string) => {
    const num = Number(value)
    if (num === correctAnswer) {
      setIsFiringConfetti(true)
      setTimeout(() => setIsFiringConfetti(false), 300)
    }
    setSelectedIndex(num)
  }

  return (
    <div className="select-text">
      <Text className="font-bold tracking-tight leading-tight resize-none text-lg w-full pb-2">
        {question}
      </Text>
      <RadioGroup
        value={selectedIndex === null ? undefined : selectedIndex}
        className="py-2"
        onChange={(value) => setAnswer(value)}
      >
        <Stack>
          {options.map((o, index) => (
            <Radio
              key={index}
              value={index}
              colorScheme={index === correctAnswer ? 'green' : 'red'}
            >
              {o.text}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
      {selectedIndex != null && (
        <>
          {selectedIndex === correctAnswer && (
            <div className="flex flex-col gap-2 p-4 rounded-xl bg-green-50">
              <Text
                color="green"
                className="font-bold tracking-tight leading-tight resize-none text-lg w-full"
              >
                Correct!
              </Text>
              {selectedOption?.explanation && (
                <Text color="green.900">{selectedOption?.explanation}</Text>
              )}
            </div>
          )}
          {selectedIndex !== correctAnswer && (
            <div className="flex flex-col gap-2 p-4 rounded-xl bg-red-50">
              <Text
                color="red"
                className="font-bold tracking-tight leading-tight resize-none text-lg w-full m-0"
              >
                Incorrect
              </Text>
              {selectedOption?.explanation && (
                <Text color="red.900">{selectedOption?.explanation}</Text>
              )}
            </div>
          )}
        </>
      )}
      <Portal>
        <Confetti isFiring={isFiringConfetti} />
      </Portal>
    </div>
  )
}

export default MultipleChoiceComponent
