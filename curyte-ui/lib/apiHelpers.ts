import { Lesson, Path, Prisma, Profile, Tag } from '@prisma/client'
import { LessonWithProfile } from '../interfaces/lesson_with_profile'

export const parseTagJson = async (res: Response) =>
  res.json().then((t) => t as Tag)

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
  res.json().then((p) => p as Path)

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

export const createLesson = async (data: Lesson) =>
  await fetch('/api/lessons/create', {
    body: JSON.stringify({ data }),
    method: 'POST',
  }).then(parseLessonJson)

export const getLesson = async (uid: string) =>
  fetch(`/api/lessons/${uid}`, {
    method: 'GET',
  }).then(parseLessonJson)

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
  })
    .then((res) => res.json())
    .then((lessons) => lessons.map((l: unknown) => l as Lesson))

export const parseProfileJson = async (res: Response) =>
  res.json().then((p) => p as Profile)

export const getProfile = async (uid: string) =>
  fetch(`/api/profiles/${uid}`, { method: 'GET' }).then(parseProfileJson)
