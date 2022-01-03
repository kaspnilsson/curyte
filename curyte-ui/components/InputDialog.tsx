import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Input,
} from '@chakra-ui/react'
import React, { useRef, useState } from 'react'

export interface InputDialogProps {
  title: string
  description: string | React.ReactNode
  isOpen: boolean
  onClose: () => void
  onConfirm: (input: string) => void
  validator?: (input: string) => boolean
  initialValue?: string
}

const InputDialog = ({
  title,
  description,
  isOpen,
  onClose,
  onConfirm,
  initialValue = '',
  validator = () => true,
}: InputDialogProps) => {
  const ref = useRef(null)
  const [value, setValue] = useState(initialValue)

  const localOnClose = () => {
    setValue('')
    onClose()
  }

  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={localOnClose}
      leastDestructiveRef={ref}
      motionPreset="slideInBottom"
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            {description}
            <Input
              className="mt-4"
              type="text"
              errorBorderColor="red"
              isInvalid={!validator(value)}
              size="lg"
              colorScheme="zinc"
              variant="outline"
              placeholder="Enter a value..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            {value && !validator(value) && (
              <span className="text-lg text-red-700">Invalid value</span>
            )}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={ref} onClick={localOnClose}>
              Cancel
            </Button>
            <Button
              className="ml-2"
              colorScheme="black"
              onClick={() => {
                localOnClose()
                onConfirm(value)
              }}
              disabled={!validator(value)}
            >
              Confirm
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default InputDialog
