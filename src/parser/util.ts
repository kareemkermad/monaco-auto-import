export const getMatches = (string: string, regex: RegExp) => {
  const matches = []
  let match: RegExpExecArray
  while ((match = regex.exec(string))) {
    matches.push(match)
  }
  return matches
}
