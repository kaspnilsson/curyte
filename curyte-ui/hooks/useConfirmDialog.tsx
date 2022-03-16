import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  AlertDialogProps,
} from '@chakra-ui/react'
import React, { ReactNode, useCallback, useRef, useState } from 'react'

interface Props {
  title: string | ReactNode
  body: string | ReactNode
  closeText?: string
  confirmText?: string
  onConfirmClick?: () => void
  size?: AlertDialogProps['size']
}

export default function useConfirmDialog({
  title,
  body,
  confirmText,
  onConfirmClick,
  closeText = 'Cancel',
  size = 'md',
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
        size={size}
      >
        <AlertDialogOverlay>
          <AlertDialogContent className="flex">
            <AlertDialogHeader className="text-lg font-bold leading-tight tracking-tighter">
              {title}
            </AlertDialogHeader>
            <AlertDialogBody>{body}</AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onClose}
                colorScheme={confirmText && confirmText ? undefined : 'black'}
              >
                {closeText}
              </Button>
              {confirmText && onConfirmClick && (
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
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    ),
    [body, closeText, confirmText, isOpen, onConfirmClick, size, title]
  )

  return {
    ConfirmDialog,
    onOpen,
  }
}
