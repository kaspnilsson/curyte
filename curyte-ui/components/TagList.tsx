import { Tag } from '@prisma/client'
import TagChip from './TagChip'

interface Props {
  tags: Tag[]
}

const TagList = ({ tags = [] }: Props) => (
  <div className="flex flex-wrap gap-2 pt-2">
    {tags.map((t, index) => (
      <TagChip tagLabel={t.tagText} key={index} size="lg" />
    ))}
  </div>
)

export default TagList
