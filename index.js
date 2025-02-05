import {readdir} from "node:fs/promises"
import path from "node:path"

export default matchup
export async function matchup(pattern, options = {}) {
  options.max    ??= 10
  options.ignore ??= ["node_modules"]

  let cwd = options.cwd ?? import.meta.dirname

  const rejoin = ({ parentPath, name }) => path.join(parentPath, name)
  const ignore = entry =>
    !options.ignore.some(part => rejoin(entry).includes(part))
    && (options.symlinks === false ? !entry.isSymbolicLink() : true)

  let depth = 1
  while (depth <= options.max) {
    const entries = await readdir(cwd, { withFileTypes: true })

    const match = entries.filter(ignore)
      .find(({ name }) => path.matchesGlob(name, pattern))

    if (match) return options.parse ? path.parse(rejoin(match)) : rejoin(match)

    if (depth === options.max || cwd === path.sep) return options.parse && {}

    else cwd = path.resolve(cwd, "..")
    depth += 1
  }
}
