/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useEffect, useState } from 'react';
import { LessonSection } from '../interfaces/lesson';
import { XIcon } from '@heroicons/react/solid';
import { useDebounceCallback } from '@react-hook/debounce';
import Button from '@material-tailwind/react/Button';
import FancyEditor from './FancyEditor';

interface Props {
  section: LessonSection;
  onChange: (value: LessonSection) => void;
  onDelete?: () => void;
}

const LessonSectionEditor = ({ section, onChange, onDelete }: Props) => {
  const [content, setContent] = useState('');
  const editorCallback = useDebounceCallback(
    useCallback(
      (getContent: () => string) =>
        onChange({ ...section, content: getContent() }),
      [onChange, section]
    ),
    100
  );
  const inputCallback = useCallback(
    ({ target }) => onChange({ ...section, title: target.value }),
    [onChange, section]
  );

  // need content to be set only once due to
  // https://github.com/outline/rich-markdown-editor/issues/285
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    setContent(section.content);
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <div>
      <div className="flex items-center justify-between">
        {section.title && (
          <textarea
            className="text-2xl focus:outline-none mt-1 flex-1 resize-none"
            placeholder="Enter section title..."
            value={section.title}
            onChange={inputCallback}
          />
        )}
        {onDelete && (
          <Button
            iconOnly
            onClick={() => onDelete()}
            color="gray"
            buttonType="outline"
          >
            <XIcon className="h-5 w-5" />
          </Button>
        )}
      </div>
      <FancyEditor content={content} onChange={editorCallback} />
    </div>
  );
};

export default LessonSectionEditor;
