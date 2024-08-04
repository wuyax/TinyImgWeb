import { fs, type FS } from '@zip.js/zip.js'

const tacit: string = '_tacit'
const zips: Map<symbol | string, FS> = new Map([[tacit, createZipFileSystem()]])

function createZipFileSystem() {
  return new fs.FS()
}

function clear() {
  zips.forEach((_, key) => {
    if (key === tacit) {
      zips.set(key, createZipFileSystem())
    } else {
      zips.delete(key)
    }
  })
}

export { tacit, createZipFileSystem, clear }
export default zips
