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
This package is _[ESM]_ [only], so must be [`import`]ed instead of [`require`]d,
and [depends] on _[Node]_ [`>=`][][`20`]:
~~~ jsonc
// package.json
"type": "module",
"engines": {
  "node": ">=20"
},
~~~

License
-------
[MIT] © [Daniel Bayley]

[MIT]:                    LICENSE.md
[Daniel Bayley]:          https://github.com/danielbayley

[node]:                   https://nodejs.org
[ESM]:                    https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules
[only]:                   https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
[`import`]:               https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import
[`require`]:              https://nodejs.org/api/modules.html#requireid
[depends]:                https://docs.npmjs.com/cli/v11/configuring-npm/package-json#engines
[`>=`]:                   https://docs.npmjs.com/cli/v6/using-npm/semver#ranges
[`20`]:                   https://github.com/nodejs/node/blob/main/doc/changelogs/CHANGELOG_V20.md

[_glob_ pattern]:         https://globster.xyz
[`import.meta.dirname`]:  https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/import.meta
[symbolic links]:         https://wikipedia.org/wiki/Symbolic_link
