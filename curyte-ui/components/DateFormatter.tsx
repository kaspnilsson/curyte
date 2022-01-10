import { parseISO } from 'date-fns'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import ReactTimeAgo from 'react-time-ago'

TimeAgo.addDefaultLocale(en)

type Props = {
  dateString: string
}

const DateFormatter = ({ dateString }: Props) => {
  return <ReactTimeAgo date={parseISO(dateString)} timeStyle="twitter" />
}

export default DateFormatter
