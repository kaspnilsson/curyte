/* eslint-disable @next/next/no-img-element */
import { Author } from '../interfaces/author';
import Image from '@material-tailwind/react/Image';
import CardHeader from '@material-tailwind/react/CardHeader';

type Props = {
  author: Author;
  photoOnly?: boolean;
};

const Avatar = ({ author, photoOnly }: Props) => {
  return (
    <>
      {!author && null}
      {author && (
        <div className="flex items-center">
          {author.photoURL ? (
            <Image
              src={author.photoURL}
              rounded={true}
              raised={true}
              className="w-10 h-10"
              alt={author.displayName}
            />
          ) : (
            <CardHeader className="round" color="gray">
              {author.displayName ? author.displayName.substring(0, 2) : '?'}
            </CardHeader>
          )}
          {!photoOnly && (
            <div className="text-lg font-bold ml-4">{author.displayName}</div>
          )}
        </div>
      )}
    </>
  );
};

export default Avatar;
