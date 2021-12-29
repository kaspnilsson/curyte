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
const searchClient = algoliasearch(
  'J2RQN6DLHP',
  'fad56d06d43541b6bdf0e83a4bdc12f5'
)

const SearchBox = ({
  currentRefinement,
  isSearchStalled,
  refine,
}: SearchBoxProvided) => (
  <InputGroup className="w-full" size="lg">
    <InputLeftElement>
      <SearchIcon className="w-5 h-5 text-zinc-500" />
    </InputLeftElement>
    <Input
      placeholder="Search..."
      variant="filled"
      autoFocus
      colorScheme="black"
      value={currentRefinement}
      onChange={(e) => refine(e.currentTarget.value)}
    />
    {isSearchStalled && (
      <InputRightElement>
        <Spinner></Spinner>
      </InputRightElement>
    )}
  </InputGroup>
)

// 2. Connect the component using the connector
const CustomSearchBox = connectSearchBox(SearchBox)

const Hits = ({
  hits,
  hasPrevious,
  refinePrevious,
  hasMore,
  refineNext,
}: InfiniteHitsProvided) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-wrap justify-center w-full gap-4 mt-8">
        {hits.map((lesson: Lesson) => (
          <LessonPreview lesson={lesson} key={lesson.uid} />
        ))}
        {!hits.length && 'None found!'}
      </div>
      <div className="items-center mt-8">
        <Button isDisabled={!hasPrevious} onClick={refinePrevious}>
          Show previous
        </Button>
        <Button isDisabled={!hasMore} onClick={refineNext}>
          Show more
        </Button>
      </div>
    </div>
  )
}
const CustomHits = connectInfiniteHits(Hits)

interface SearchProps {
  onSelect?: (l: Lesson) => void
}

const Search = ({}: SearchProps) => {
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
        {query && <CustomHits />}
      </InstantSearch>
    </div>
  )
}
export default Search
