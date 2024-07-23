import { BlobReader, ZipReader, type Entry, type GetEntriesOptions } from "@zip.js/zip.js"

export const support = ['jpg', 'jpeg', 'png', 'webp']

/**
 * 获取图片的 mime
 * @param bytes
 * @returns
 */
export function getMimeType(bytes: Uint8Array): string {
  const signatures: { [key: string]: string } = {
    '89504E47': 'image/png',
    FFD8FF: 'image/jpeg',
    '47494638': 'image/gif',
    '49492A00': 'image/tiff',
    '424D': 'image/bmp',
    '52494646': 'image/webp'
  }

  const hexString = bytes.slice(0, 4).reduce((acc, byte) => {
    return acc + byte.toString(16).padStart(2, '0').toUpperCase()
  }, '')

  for (const signature in signatures) {
    if (hexString.startsWith(signature)) {
      return signatures[signature]
    }
  }

  return 'unknown'
}

/**
 * Unity8Array 转换为 base64
 * @param u8
 * @returns
 */
export async function u82img(u8: Uint8Array): Promise<string> {
  const type = getMimeType(u8)
  if (type === 'unknown') {
    // 判断是否支持的类型
    return ''
  }
  const blob = new Blob([u8], { type })
  const dataUrl = URL.createObjectURL(blob)
  return fetch(dataUrl)
    .then(response => response.blob())
    .then(blob => {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      return new Promise(reslove => {
        reader.onloadend = () => {
          reslove(reader.result as string)
        }
      })
    })
}

/**
 * 生成随机 ID
 * @param length
 * @returns
 */
export function uId(length = 6) {
  let result = ''
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let charactersLength = characters.length

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}

export function isAPNG(bytes: Uint8Array) {
  // Check if it's a valid PNG file
  const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
  for (let i = 0; i < pngSignature.length; i++) {
    if (bytes[i] !== pngSignature[i]) {
      return false // Not a valid PNG file
    }
  }

  // Search for 'acTL' chunk which indicates APNG
  const acTLChunk = [0x61, 0x63, 0x54, 0x4c]
  for (let i = 8; i < bytes.length - 8; i++) {
    if (
      bytes[i] === acTLChunk[0] &&
      bytes[i + 1] === acTLChunk[1] &&
      bytes[i + 2] === acTLChunk[2] &&
      bytes[i + 3] === acTLChunk[3]
    ) {
      return true // Found 'acTL' chunk, it's an APNG file
    }
  }

  return false // No 'acTL' chunk found, it's a normal PNG file
}

export async function fileToBlob(file: File): Promise<Blob> {
  return new Promise((reslove, rejcet) => {
    if (!file) {
      rejcet('no file')
      return
    }
    const reader = new FileReader()

    reader.onload = function (e) {
      if (!e.target || !e.target.result) return
      const blob = new Blob([new Uint8Array(e.target.result as ArrayBuffer)], { type: file.type })
      reslove(blob)
    }

    reader.readAsArrayBuffer(file)
  })
}

export async function fileToB64(file: File) {
  return new Promise((reslove, rejcet) => {
    if (!file) {
      rejcet('no file')
      return
    }
    const reader = new FileReader()

    reader.onload = function (e) {
      // @ts-ignore
      const base64Image = e.target.result
      reslove(base64Image)
    }

    reader.readAsDataURL(file)
  })
}

/**
 * 解析压缩文件
 * @param file
 * @param options
 * @returns
 */
export function unZip(file: File, options: GetEntriesOptions): Promise<Entry[]> {
  return new ZipReader(new BlobReader(file)).getEntries(options)
}