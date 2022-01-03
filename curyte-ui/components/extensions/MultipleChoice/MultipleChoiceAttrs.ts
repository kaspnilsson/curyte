export interface Option {
  text: string
  explanation?: string
}

export interface MultipleChoiceAttrs {
  question: string
  options: Option[]
  // Index of the right answer
  correctAnswer: number
}
