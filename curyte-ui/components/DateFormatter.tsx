import { parseISO, format } from 'date-fns'

type Props = {
  dateString: string
}

const today = new Date()

const DateFormatter = ({ dateString }: Props) => {
  const date = parseISO(dateString)
  const dateFormat =
    date.getFullYear() === today.getFullYear() ? 'LLL	d' : 'LLL	d, yyyy'
  return <time dateTime={dateString}>{format(date, dateFormat)}</time>
}

export default DateFormatter
