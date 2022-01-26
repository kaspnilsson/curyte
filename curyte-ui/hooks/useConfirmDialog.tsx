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

export default function useConfirmDialog({
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

  const ConfirmDialog = useCallback(
    () => (
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        isCentered
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
              <Button
                colorScheme="black"
                onClick={() => {
                  onConfirmClick()
                  onClose()
                }}
                ml={3}
              >
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
    ConfirmDialog,
    onOpen,
  }
}
