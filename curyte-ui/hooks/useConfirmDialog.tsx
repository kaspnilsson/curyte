import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react'
import React, { useCallback, useRef, useState } from 'react'

interface Props {
  title: string
  body: string
  confirmText: string
  onConfirmClick: () => void
}

export default function useConfirmationDialog({
  title,
  body,
  confirmText,
  onConfirmClick,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const onClose = () => setIsOpen(false)
  const cancelRef = useRef(null)

  const onOpen = () => {
    setIsOpen(true)
  }

  const Dialog = useCallback(
    () => (
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader className="text-lg font-bold leading-tight tracking-tighter">
              {title}
            </AlertDialogHeader>
            <AlertDialogBody>{body}</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="black" onClick={onConfirmClick} ml={3}>
                {confirmText}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    ),
    [body, confirmText, isOpen, onConfirmClick, title]
  )

  return {
    Dialog,
    onOpen,
  }
}