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
