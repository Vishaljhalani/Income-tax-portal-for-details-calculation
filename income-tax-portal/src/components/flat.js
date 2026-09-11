export const getAllSections = (chapters) => {
  return chapters.flatMap((chapter) =>
    chapter.annexure.map((sec) => ({
      chapter: chapter.chapter,
      topic: chapter.topic,
      Section: sec.Section,
      title: sec.title,
      pdf: sec.pdf,
    }))
  );
};