import React, { useState } from 'react'
import algoliasearch from 'algoliasearch/lite'
import { InstantSearch, connectSearchBox } from 'react-instantsearch-dom'
import { Lesson } from '../interfaces/lesson'
import LessonPreview from './LessonPreview'
import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
} from '@chakra-ui/react'
import {
  Configure,
  connectInfiniteHits,
  InfiniteHitsProvided,
  SearchBoxProvided,
} from 'react-instantsearch-core'
import { SearchIcon } from '@heroicons/react/outline'
import { debounce } from 'ts-debounce'
const searchClient = algoliasearch(
  'J2RQN6DLHP',
  'fad56d06d43541b6bdf0e83a4bdc12f5'
)

const SearchBox = ({ isSearchStalled, refine }: SearchBoxProvided) => {
  const [query, setQuery] = useState('')

  const debouncedRefine = debounce((q: string) => {
    refine(q)
  }, 500)

  const refineQuery = (q: string) => {
    setQuery(q)
    debouncedRefine(q)
  }
  return (
    <InputGroup className="w-full" size="lg">
      <InputLeftElement>
        <SearchIcon className="w-5 h-5 text-zinc-500" />
      </InputLeftElement>
      <Input
        placeholder="Search..."
        variant="filled"
        autoFocus
        colorScheme="black"
        value={query}
        onChange={(e) => refineQuery(e.currentTarget.value)}
      />
      {isSearchStalled && (
        <InputRightElement>
          <Spinner></Spinner>
        </InputRightElement>
      )}
    </InputGroup>
  )
}

// 2. Connect the component using the connector
const CustomSearchBox = connectSearchBox(SearchBox)

interface CustomHitsProps extends Partial<InfiniteHitsProvided> {
  onSelect?: (l: Lesson) => void
}

const Hits = ({ hits, hasMore, refineNext, onSelect }: CustomHitsProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-wrap justify-center w-full gap-4 pt-4 mt-4 border-t-2 border-zinc-200">
        {hits &&
          hits.map((lesson: Lesson) => (
            <LessonPreview
              onClick={onSelect}
              lesson={lesson}
              key={lesson.uid}
            />
          ))}
        {!hits?.length && 'None found!'}
      </div>
      <div className="items-center mt-8">
        <Button isDisabled={!hasMore} onClick={refineNext}>
          Show more
        </Button>
      </div>
    </div>
  )
}
const CustomHits = connectInfiniteHits<CustomHitsProps, Lesson>(Hits)

interface SearchProps {
  onSelect?: (l: Lesson) => void
}

const Search = ({ onSelect }: SearchProps) => {
  const [query, setQuery] = useState('')
  return (
    <div>
      <InstantSearch
        searchClient={searchClient}
        indexName="lessons-index"
        onSearchStateChange={(searchState) => {
          setQuery(searchState.query)
        }}
      >
        <Configure hitsPerPage={9} />
        <CustomSearchBox />
        {query && <CustomHits onSelect={onSelect} />}
      </InstantSearch>
    </div>
  )
}
export default Search
