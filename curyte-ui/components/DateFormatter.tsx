import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import ReactTimeAgo from 'react-time-ago'
import { parseISO } from 'date-fns'

TimeAgo.addDefaultLocale(en)

type Props = {
  date: Date | string
}

const DateFormatter = ({ date }: Props) => {
  return (
    <ReactTimeAgo
      date={typeof date === 'string' ? parseISO(date) : date}
      timeStyle="round-minute"
    />
  )
}

export default DateFormatter
