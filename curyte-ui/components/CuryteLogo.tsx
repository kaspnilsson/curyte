import Image from 'next/image'

interface Props {
  width?: string | number
  height?: string | number
}

const CuryteLogo = ({ width = '24px', height = '24px' }: Props) => (
  <Image
    src="/static/curyte_logo_black.svg"
    alt="Curyte logo"
    width={width}
    height={height}
  />
)
export default CuryteLogo
