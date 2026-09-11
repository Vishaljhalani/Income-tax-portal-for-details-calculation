export const searchSections = (data, query) => {
  if (!query) return data;

  const q = query.toLowerCase();

  return data.filter((item) => {
    return (
      item.Section.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q) ||
      item.chapter.toLowerCase().includes(q) ||
      item.topic.toLowerCase().includes(q)
    );
  });
};