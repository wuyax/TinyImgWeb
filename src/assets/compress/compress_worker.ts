declare function importScripts(...urls: string[]): void

// todo 根据部署环境修改路径
self.Module = {}
self.Module.locateFile = (path: string) => {
  return `./wasm/${path}`
}
importScripts('./wasm/libcaesium-wasm.js')
let wasmModule: any
self.Module.onRuntimeInitialized = () => {
  wasmModule = self.Module
  self.postMessage({ type: 'initialized' })
}

function onMessage(event: MessageEvent) {
  const type = event.data.type
  if (type === 'compress') {
    compress(event.data)
  } else if (type === 'close') {
    // close worker
    self.close()
  }
}

interface CompressData {
  id: string
  input: Uint8Array
  quality: number
  keepMetadata: number
}
function compress(data: CompressData) {
  const { id, input, quality, keepMetadata } = data

  const inputPtr = wasmModule._malloc(input.length)
  wasmModule.HEAPU8.set(input, inputPtr)

  const resultPtr = wasmModule._w_compress(inputPtr, input.length, quality, keepMetadata)

  const result = new Uint32Array(self.Module.HEAPU8.buffer, resultPtr, 5)
  const status = result[0]
  const errorCode = result[1]
  const dataPtr = result[2]
  const dataLen = result[3]
  const dataCap = result[4]

  if (status === 1) {
    const compressedData = new Uint8Array(self.Module.HEAPU8.buffer, dataPtr, dataLen)

    // creat a Transferable Objects
    const bufferCopy = new ArrayBuffer(compressedData.byteLength)
    const copyView = new Uint8Array(bufferCopy)
    copyView.set(compressedData)
    // @ts-ignore
    self.postMessage({ type: 'compressed', id, status, data: bufferCopy }, [bufferCopy])
  } else {
    self.postMessage({ type: 'compressed', id, status, errorCode })
  }

  // free the memory
  wasmModule._free(inputPtr)
  wasmModule._drop_vector_struct(resultPtr)
}

self.addEventListener('message', onMessage)
self.onmessageerror = error => {
  self.postMessage('error')
  console.log(error)
}
