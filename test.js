import assert from "node:assert/strict"
import { describe, it, beforeEach, afterEach } from "node:test"
import fs from "node:fs/promises"
import { parse, sep, join, format, basename } from "node:path"
import { createFixture } from "fs-fixture"

assert.basename  ??= (path, base) => assert.equal(basename(path), base)
assert.includes  ??= (a, b) => assert.equal(a.includes(b), true)
assert.undefined ??= unit => unit === undefined

const module = "./index.js"
const {matchup}  = await import(module)
const {encoding} = new TextDecoder()
const random = Math.max().toString(36).substring(7)

const file    = "file.ext"
const subpath = "sub/folder"
const target  = `..${file}`
const symlink = ({ symlink }) => symlink(target)
const folder  = { [Date.now()]: encoding }
const tree    = {
  [file]: encoding,
  sub: { folder, [file]: symlink }
}

describe("matchup", () => {
  let fixtures, cwd
  afterEach(() => fixtures.rm())
  beforeEach(mkdir)
  async function mkdir() {
    fixtures = await createFixture(tree)
    cwd = fixtures.getPath(subpath)
  }

  it("finds nearest matching file", async () => {
    const match = await matchup(file, {cwd})
    assert.basename(match, file)
  })

  it("finds matching directory", async () => {
    const match = await matchup("sub", {cwd})
    assert.basename(match, "sub")
  })

  it("finds matching glob pattern", async () => {
    const {ext}   = parse(file)
    const pattern = file.replace(ext, ".*")
    const match   = await matchup(pattern, {cwd})
    assert.basename(match, file)
  })

  it("else undefined if no match", async () => {
    const match = await matchup(`.${random}`, {cwd})
    assert.undefined(match)
  })

  it("finds match up from dependency", async () => {
    const subpath    = "node_modules/@scope/package"
    const dependency = join(subpath, module)
    const pkg        = join(subpath, "package.json")
    const fixtures   = await createFixture({
      [file]: encoding,
      [pkg]: JSON.stringify({ type: "module" }),
      [dependency]: await fs.readFile(module, { encoding }),
    })
    const {matchup} = await import(fixtures.getPath(dependency))
    const  match    = await matchup(file)
    assert.basename(match, file)
    fixtures.rm()
  })

  it("ignores entries matching the given ignore patterns", async () => {
    const ignore = subpath.split(sep).slice(0, 1)
    const match  = await matchup(file, { cwd, ignore })
    assert.includes(match, fixtures.path)
  })

  it("finds no match limited by depth", async () => {
    const match = await matchup(file, { cwd, max: 1 })
    assert.undefined(match)
  })

  it("matches symbolic links unless symlinks: false", async () => {
    const read = await fs.readlink(fixtures.getPath(`sub/${file}`))
    assert.equal(read, target)

    const cwd   = fixtures.getPath(subpath)
    const match = await matchup(file, { cwd })
    const root  = await matchup(file, { cwd, symlinks: false })
    assert.notEqual(match, root)
  })

  it("optionally returns a path object for the match", async () => {
    const match = await matchup(file, { cwd, parse: true })
    assert.doesNotThrow(() => format(match))
  })

  it("else an empty object if no match", async () => {
    const object = await matchup(`.${random}`, { cwd, parse: true })
    assert.deepEqual(object, {})
  })
})
