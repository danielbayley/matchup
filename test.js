import assert from "node:assert/strict"
import { describe, it, beforeEach, afterEach } from "node:test"
import fs from "node:fs/promises"
import { parse, sep, join, format } from "node:path"
import { createFixture } from "fs-fixture"
import { matchUp } from "./index.js"

const { encoding } = new TextDecoder()

const file    = "file.ext"
const subpath = "sub/folder"
const target  = `..${file}`
const symlink = ({ symlink }) => symlink(target)
const folder  = { [Date.now()]: encoding }
const tree    = {
  [file]: encoding,
  sub: { folder, [file]: symlink }
}

describe("matchUp", () => {
  let fixtures, cwd
  afterEach(() => fixtures.rm())
  beforeEach(mkdir)
  async function mkdir() {
    fixtures = await createFixture(tree)
    cwd = fixtures.getPath(subpath)
  }

  it("return path object for match", async () => {
    const path = await matchUp(file, { cwd })
    assert.doesNotThrow(() => format(path))
  })

  it("or an empty object if no match", async () => {
    const random = Math.max().toString(36).substring(7)
    const object = await matchUp(`.${random}`, { cwd })
    assert.deepEqual(object, {})
  })

  it("find nearest matching file", async () => {
    const {base} = await matchUp(file, {cwd})
    assert.equal(base, file)
  })

  it("find matching directory", async () => {
    const {name} = await matchUp("sub", { cwd })
    assert.equal(name, "sub")
  })

  it("find matching glob pattern", async () => {
    const {ext}   = parse(file)
    const pattern = file.replace(ext, ".*")
    const {base}  = await matchUp(pattern, { cwd })
    assert.equal(base, file)
  })

  it("find match up from dependency", async () => {
    const index      = "index.js"
    const dependency = "node_modules/@scope/package"
    const module     = join(dependency, index)
    const fixtures   = await createFixture({
      [file]: encoding,
      [module]: await fs.readFile(index, { encoding })
    })
    const {matchUp} = await import(fixtures.getPath(module))
    const {base}    = await matchUp(file)
    assert.equal(base, file)
    fixtures.rm()
  })

  it("ignore entries with given ignore patterns", async () => {
    const ignore = subpath.split(sep).slice(0, 1)
    const {dir}  = await matchUp(file, { cwd, ignore })
    assert.equal(dir + sep, fixtures.path)
  })

  it("find no match limited by depth", async () => {
    const match = await matchUp(file, { cwd, max: 1 })
    assert.deepEqual(match, {})
  })

  it("match symbolic link unless symlinks: false", async () => {
    const read = await fs.readlink(fixtures.getPath(`sub/${file}`))
    assert.equal(read, target)

    const cwd   = fixtures.getPath(subpath)
    const match = await matchUp(file, { cwd })
    const root  = await matchUp(file, { cwd, symlinks: false })
    assert.notDeepEqual(match, root)
  })
})
