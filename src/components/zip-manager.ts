import { fs, type FS } from '@zip.js/zip.js'

function createZipFileSystem() {
  return new fs.FS()
}
const tacit: string = '_tacit'
const zips: Map<symbol | string, FS> = new Map([[tacit, createZipFileSystem()]])

export { tacit, createZipFileSystem }
export default zips
