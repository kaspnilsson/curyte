export declare interface LessonMeta {
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  author: string;
  lessonId: string;
}

export declare interface LessonInfo {
  meta: LessonMeta;
  sections: LessonSection[];
  lessonId: string;
}

export declare interface LessonSection {
  title: string;
  content: string;
}

export declare interface LessonStorageModel {
  authorId: string;
  authorName: string;
  lessonId?: string;
  title: string;
  description: string;
  created?: string;
  updated?: string;
  parentLessonId?: string;
  sections: LessonSection[];
}
