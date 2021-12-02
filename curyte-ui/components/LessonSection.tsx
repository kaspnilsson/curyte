import React from 'react'
import { LessonSection } from '../interfaces/lesson'
import FancyEditor from './FancyEditor'

type Props = {
  section: LessonSection
}

const LessonSection = ({ section }: Props) => {
  return (
    <div className="py-8">
      <h1>{section.title}</h1>
      <FancyEditor content={section.content} readOnly />
    </div>
  )
}

export default LessonSection
