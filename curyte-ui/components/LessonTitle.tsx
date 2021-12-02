import React, { ReactNode } from 'react';

type Props = {
  title: string;
  isDraft?: boolean;
};

const LessonTitle = ({ title, isDraft }: Props) => {
  return (
    <div className="mb-4">
      <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight md:leading-none text-center md:text-left">
        {title}
      </h1>
    </div>
  );
};

export default LessonTitle;
