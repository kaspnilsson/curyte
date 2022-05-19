import { IconButton, Select, Spinner } from '@chakra-ui/react'
import { XIcon } from '@heroicons/react/outline'
import React, { useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { translate } from '../lib/apiHelpers'

const LANGUAGES = {
  es: 'Spanish',
  ko: 'Korean',
  fr: 'French',
  am: 'Amharic',
  'zh-CN': 'Chinese',
  vi: 'Vietnamese',
}

interface Props {
  text: string
  onClose: () => void
}

const TranslatePanel = ({ text, onClose }: Props) => {
  const [lang, setLang] = useLocalStorage<keyof typeof LANGUAGES>(
    'translate-lang',
    'es'
  )
  const [loading, setLoading] = useState(true)
  const [translated, setTranslated] = useState('')

  useEffect(() => {
    if (!text || !lang) return
    let aborted = false
    const fetchTranslation = async () => {
      setLoading(true)
      const val = await translate(text, lang)
      if (aborted) return
      setTranslated(val.translation)
      setLoading(false)
    }

    fetchTranslation()
    return () => {
      aborted = true
    }
  }, [lang, text])

  // Reset component state when text changes.
  useEffect(() => {
    setTranslated('')
    setLoading(true)
  }, [text])

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold leading-tight tracking-tighter truncate ">
          Translate
        </h3>
        <IconButton
          onClick={onClose}
          size="xs"
          variant="ghost"
          aria-label="Close"
        >
          <XIcon className="w-5 h-5 text-zinc-500" />
        </IconButton>
      </div>
      <div className="p-2 border rounded-xl bg-zinc-50">{text}</div>
      <Select
        placeholder="Choose a language"
        value={lang}
        onChange={(event) =>
          setLang(event.currentTarget.value as keyof typeof LANGUAGES)
        }
      >
        {Object.entries(LANGUAGES).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </Select>
      {loading && <Spinner />}
      {!loading && (
        <div className="p-2 border rounded-xl bg-zinc-50">
          {translated && translated}
          {!translated && (
            <span className="text-red-500">No translation found!</span>
          )}
        </div>
      )}
    </div>
  )
}

export default TranslatePanel
