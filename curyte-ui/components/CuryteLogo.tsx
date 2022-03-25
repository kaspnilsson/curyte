import Image from 'next/image'

interface Props {
  width?: string | number
  height?: string | number
  color?: 'black' | 'white'
  className?: string
}

const CuryteLogo = ({
  width = '24px',
  height = '24px',
  color = 'black',
  className = '',
}: Props) => (
  <Image
    src={
      color === 'black'
        ? '/static/curyte_logo_black.svg'
        : '/static/curyte_logo_white.svg'
    }
    alt="Curyte logo"
    width={width}
    height={height}
    className={className}
  />
)
export default CuryteLogo
