<img src="logo.svg" width="18%" align="right"/>

Matchup
=======
Find the first path matching a [_glob_ pattern], walking up from a given directory.

## Example
~~~ js
import {matchUp} from "@danielbayley/matchup"

const metadata = await matchup("package.*", { cwd: import.meta.dirname })
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
pnpm install @danielbayley/match-up
~~~

License
-------
[MIT] © [Daniel Bayley]

[MIT]:                    LICENSE.md
[Daniel Bayley]:          https://github.com/danielbayley

[_glob_ pattern]:         https://globster.xyz
[`import.meta.dirname`]:  https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/import.meta
[symbolic links]:         https://wikipedia.org/wiki/Symbolic_link
