import firebase from '../../firebase/clientApp';
import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import React, { SyntheticEvent, useReducer, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { PlusIcon, UploadIcon } from '@heroicons/react/solid';
import Button from '@material-tailwind/react/Button';

import Container from '../../components/Container';
import Layout from '../../components/Layout';
import LessonSectionEditor from '../../components/LessonSectionEditor';
import { LessonSection } from '../../interfaces/lesson';
import LoadingSpinner from '../../components/LoadingSpinner';

const initialState = { sections: [{ title: '', content: '' }] };

enum LessonSectionActionType {
  ADD = 'ADD',
  EDIT = 'EDIT',
  REMOVE = 'REMOVE',
}

// An interface for our actions
interface LessonSectionAction {
  type: LessonSectionActionType;
  payload?: {
    index?: number;
    section?: LessonSection;
  };
}

interface LessonSectionState {
  sections: LessonSection[];
}

function reducer(state: LessonSectionState, action: LessonSectionAction) {
  switch (action.type) {
    case LessonSectionActionType.ADD: {
      return {
        ...state,
        sections: [...state.sections, { title: '', content: '' }],
      };
    }
    case LessonSectionActionType.EDIT: {
      if (
        !action.payload ||
        action.payload.index === undefined ||
        action.payload.section === undefined
      ) {
        throw new Error('Invalid payload for action: ' + action);
      }
      const sections = [...state.sections];
      sections[action.payload.index] = action.payload.section;
      return {
        ...state,
        sections,
      };
    }
    case LessonSectionActionType.REMOVE: {
      if (!action.payload || action.payload.index === undefined) {
        throw new Error('Invalid payload for action: ' + action);
      }
      const sections = [...state.sections];
      sections.splice(action.payload.index, 1);
      return {
        ...state,
        sections,
      };
    }
    default:
      throw new Error();
  }
}

const NewLessonView = () => {
  const router = useRouter();
  const [user, loading, error] = useAuthState(firebase.auth());

  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [description, setDescription] = useState('');
  const [state, dispatch] = useReducer(reducer, initialState);
  if (loading) return <LoadingSpinner />;

  if (router.isFallback || (!loading && !user))
    return <ErrorPage statusCode={404} />;

  const canSubmit = !!(
    title &&
    description &&
    state.sections.length &&
    state.sections.every((section) => section.title && section.content)
  );

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setSaving(true);
    const ref = await firebase.firestore().collection('lessons').add({
      title,
      description,
      authorName: user!.displayName,
      authorId: user!.uid,
      sections: state.sections,
      created: firebase.firestore.Timestamp.now().toDate().toISOString(),
    });
    setSaving(false);
    router.push(`/lessons/${ref.id}`);
  };

  return (
    <Layout>
      <Container>
        <div className="flex flex-col">
          <div className="flex items-center justify-between w-full">
            <input
              className="text-4xl focus:outline-none font-semibold flex-grow"
              type="text"
              placeholder="Enter title..."
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
            <Button
              disabled={!canSubmit}
              buttonType="outline"
              className="disabled:opacity-50 font-semibold flex items-center justify-between"
              onClick={handleSubmit}
            >
              <UploadIcon className="h-5 w-5 mr-2" />
              Publish
            </Button>
          </div>
          <input
            className="text-2xl focus:outline-none mt-1 text-gray-500"
            type="text"
            placeholder="Enter description..."
            value={description}
            onChange={({ target }) => setDescription(target.value)}
          />
          <div className="flex flex-col pb-16">
            {state.sections.map((section, index) => (
              <div className="border-t border-gray-200 pt-8 mt-8" key={index}>
                <LessonSectionEditor
                  section={section}
                  onDelete={() => {
                    dispatch({
                      type: LessonSectionActionType.REMOVE,
                      payload: { index },
                    });
                  }}
                  onChange={(section) => {
                    dispatch({
                      type: LessonSectionActionType.EDIT,
                      payload: { section, index },
                    });
                  }}
                />
              </div>
            ))}
            {/* <Button
              buttonType="outline"
              className="mt-4 font-semibold py-2 px-4 m-auto flex items-center justify-between"
              onClick={() =>
                dispatch({
                  type: LessonSectionActionType.ADD,
                })
              }
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add lesson section
            </Button> */}
          </div>
        </div>
      </Container>
    </Layout>
  );
};

export default NewLessonView;
