/* eslint-disable @next/next/no-img-element */
import { Author } from '../interfaces/author';
import Image from '@material-tailwind/react/Image';

type Props = {
  author: Author;
  photoOnly?: boolean;
};

const Avatar = ({ author, photoOnly }: Props) => {
  return (
    <div className="flex items-center">
      <Image
        src={author.photoURL}
        rounded={true}
        raised={true}
        className="w-10 h-10"
        alt={author.displayName}
      />
      {!photoOnly && (
        <div className="text-lg font-bold ml-4">{author.displayName}</div>
      )}
    </div>
  );
};

export default Avatar;
