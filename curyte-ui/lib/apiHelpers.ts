import { Lesson, Notes, Path, Prisma, Profile, Tag } from '@prisma/client'
import { AttributedPhoto } from '../interfaces/attributed_photo'
import { LessonWithProfile } from '../interfaces/lesson_with_profile'
import { PathWithProfile } from '../interfaces/path_with_profile'

export const parseTagJson = async (res: Response) =>
  res.json().then((t) => t as Tag)

export const parseTagsJson = async (res: Response) =>
  res.json().then((tags) => tags.map((t: unknown) => t as Tag))

export const queryTags = async (q: string) =>
  fetch(`/api/tags/search?q=${q}`, {
    method: 'GET',
  }).then(parseTagsJson)

export const getTag = async (tagText: string) =>
  fetch(`/api/tags/${tagText}`, { method: 'GET' }).then(parseTagJson)

export const updateTag = async (
  tagText: string,
  args: Prisma.XOR<Prisma.TagUpdateInput, Prisma.TagUncheckedUpdateInput>
) =>
  fetch(`/api/tags/${tagText}`, {
    method: 'PUT',
    body: JSON.stringify(args),
  }).then(parseTagJson)

export const parsePathJson = async (res: Response) =>
  res.json().then((p) => p as PathWithProfile)

export const parsePathsJson = async (res: Response) =>
  res.json().then((paths) => paths.map((p: unknown) => p as PathWithProfile))

export const queryPaths = async (q: string) =>
  fetch(`/api/paths/search?q=${q}`, {
    method: 'GET',
  }).then(parsePathsJson)

export const createPath = async (data: Path) =>
  await fetch('/api/paths/create', {
    body: JSON.stringify({ data }),
    method: 'POST',
  }).then(parsePathJson)

export const updatePath = async (
  uid: string,
  args: Prisma.XOR<Prisma.PathUpdateInput, Prisma.PathUncheckedUpdateInput>
) =>
  fetch(`/api/paths/${uid}`, {
    method: 'PUT',
    body: JSON.stringify(args),
  }).then(parsePathJson)

export const parseLessonJson = async (res: Response) =>
  res.json().then((l) => l as LessonWithProfile)

export const parseLessonsJson = async (res: Response) =>
  res
    .json()
    .then((lessons) => lessons.map((l: unknown) => l as LessonWithProfile))

export const createLesson = async (data: Lesson) =>
  await fetch('/api/lessons/create', {
    body: JSON.stringify({ data }),
    method: 'POST',
  }).then(parseLessonJson)

export const copyLesson = async (uid: string) =>
  await fetch(`/api/lessons/create?copyFrom=${uid}`, {
    method: 'POST',
  }).then(parseLessonJson)

export const getLesson = async (uid: string) =>
  fetch(`/api/lessons/${uid}`, {
    method: 'GET',
  }).then(parseLessonJson)

export const queryLessons = async (q: string) =>
  fetch(`/api/lessons/search?q=${q}`, {
    method: 'GET',
  }).then(parseLessonsJson)

export const deleteLesson = async (uid: string) =>
  fetch(`/api/lessons/${uid}`, { method: 'DELETE' })

export const updateLesson = async (
  uid: string,
  args: Prisma.XOR<Prisma.LessonUpdateInput, Prisma.LessonUncheckedUpdateInput>
) =>
  fetch(`/api/lessons/${uid}`, {
    method: 'PUT',
    body: JSON.stringify(args),
  }).then(parseLessonJson)

export const getLessons = async (args: Prisma.LessonFindManyArgs) =>
  fetch(`/api/lessons`, {
    method: 'POST',
    body: JSON.stringify(args),
  }).then(parseLessonsJson)

export const parseProfileJson = async (res: Response) =>
  res.json().then((p) => p as Profile)

export const parseProfilesJson = async (res: Response) =>
  res.json().then((profiles) => profiles.map((p: unknown) => p as Profile))

export const getProfile = async (uid: string) =>
  fetch(`/api/profiles/${uid}`, { method: 'GET' }).then(parseProfileJson)

export const updateProfile = async (
  uid: string,
  args: Prisma.XOR<
    Prisma.ProfileUpdateInput,
    Prisma.ProfileUncheckedUpdateInput
  >
) =>
  fetch(`/api/profiles/${uid}`, {
    method: 'PUT',
    body: JSON.stringify(args),
  }).then(parseProfileJson)

export const queryProfiles = async (q: string) =>
  fetch(`/api/profiles/search?q=${q}`, {
    method: 'GET',
  }).then(parseProfilesJson)

export const searchImages = async (
  q: string
): Promise<AttributedPhoto[] | undefined> =>
  fetch(`/api/unsplash/search?q=${q}`, {
    method: 'GET',
  }).then((res) => res.json())

export const trackUnsplashDownload = async (url: string) =>
  fetch(`/api/unsplash/mark_download?url=${url}`, {
    method: 'PUT',
  }).then((res) => res.json())

export const parseNotesJson = async (res: Response) =>
  res.json().then((n) => n as Notes)

export const parseNotesArrJson = async (res: Response) =>
  res.json().then((notes) => notes.map((n: unknown) => n as Notes))

export const queryNotesForLesson = async (lessonId: string) =>
  fetch(`/api/notes/search?lessonId=${lessonId}`, {
    method: 'GET',
  }).then(parseNotesArrJson)

export const getNotes = async (lessonId: string) =>
  fetch(`/api/notes?lessonId=${lessonId}`, { method: 'GET' }).then(
    parseNotesJson
  )

export const updateNotes = async (
  lessonId: string,
  args: Prisma.XOR<Prisma.NotesUpdateInput, Prisma.NotesUncheckedUpdateInput>
) =>
  fetch(`/api/notes?lessonId=${lessonId}`, {
    method: 'PUT',
    body: JSON.stringify(args),
  }).then(parseNotesJson)
