<img src="logo.svg" width="160vw" align="right"/>
<br><br>

Matchup
=======
Find the first path matching a [_glob_ pattern], walking up from a given directory.

## Example
~~~ js
import fs   from "node:fs/promises"
import path from "node:path"
import {matchup} from "@danielbayley/matchup"

const cwd = import.meta.dirname
const metadata = await matchup("package.*", { cwd })
  .then(path.format)
  .then(fs.readFile)
  .then(JSON.parse)
  .catch(console.error)

console.log(metadata.type) // module
~~~

Options
------------------------------------------------------------------------------------
| Option     | Default                 | Description                               |
|:-----------|:------------------------|:------------------------------------------|
| `cwd`      | [`import.meta.dirname`] | Search starting point.                    |
| `ignore`   | `["node_modules"]`      | `ignore` paths containing these patterns. |
| `max`      | `10`                    | Maximum upward traversal depth.           |
| `symlinks` |                         | `false` will not match [symbolic links].  |

## Install
~~~ sh
pnpm install @danielbayley/matchup
~~~

License
-------
[MIT] © [Daniel Bayley]

[MIT]:                    LICENSE.md
[Daniel Bayley]:          https://github.com/danielbayley

[_glob_ pattern]:         https://globster.xyz
[`import.meta.dirname`]:  https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/import.meta
[symbolic links]:         https://wikipedia.org/wiki/Symbolic_link
