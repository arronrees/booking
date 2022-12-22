const eventTypes: string[] = [
  'music',
  'festival',
  'theatre',
  'sport',
  'comedy',
  'other',
];

export default function checkEventTypeMatchesQuery(query: string) {
  let matches = false;

  eventTypes.forEach((type) => {
    if (type === query) {
      matches = true;
    }
  });

  return matches;
}
