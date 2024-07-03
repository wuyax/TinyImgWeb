import { uId, getMimeType } from './utils'

interface CompressConfig {
  quality: number
  keepMetadata: boolean
}

type FB = File | Blob

function loadWorker(): Promise<Worker> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./compress_worker.ts', import.meta.url), {
      type: 'classic'
    })

    const timer = setTimeout(() => {
      reject('load worker timeout!')
    }, 10 * 1000)

    worker.addEventListener('message', event => {
      if (event.data.type === 'initialized') {
        resolve(worker)
        clearTimeout(timer)
      }
    })
  })
}

export async function compress(
  file: FB,
  config: CompressConfig = { quality: 75, keepMetadata: true },
  worker?: Worker
): Promise<ImageData> {
  if (!worker) {
    try {
      worker = await loadWorker()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return compressSingle(file, config, worker)
}

function compressSingle(file: FB, config: CompressConfig, worker: Worker): Promise<ImageData> {
  const msgId = uId()

  return new Promise((reslove, reject) => {
    const onMessage = (event: MessageEvent<any>) => {
      const { type, id, status, data, errorCode } = event.data
      if (type === 'compressed') {
        if (status === 1) {
          if (msgId === id) {
            reslove(new ImageData(data))
          }
        } else {
          reject(errorCode)
        }
      }

      worker.removeEventListener('message', onMessage)
      worker.removeEventListener('error', onError)
    }

    const onError = (error: ErrorEvent | string) => {
      reject(error)
      worker.removeEventListener('message', onMessage)
      worker.removeEventListener('error', onError)
    }
    worker.addEventListener('message', onMessage)

    const reader = new FileReader()
    reader.onload = function (event) {
      if (!event.target) {
        return
      }
      const arrayBuffer = event.target.result as ArrayBuffer
      const input = new Uint8Array(arrayBuffer)
      worker.postMessage({
        id: msgId,
        type: 'compress',
        input: input,
        quality: config.quality,
        keepMetadata: +config.keepMetadata
      })
    }
    reader.readAsArrayBuffer(file)
  })
}

class ImageData {
  private data: Uint8Array
  private mimeType: string

  constructor(data: Uint8Array) {
    this.data = data
    this.mimeType = getMimeType(this.data)
  }
  toBase64(): string {
    let binary = ''
    const len = this.data.byteLength
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(this.data[i])
    }
    return `data:${this.mimeType};base64,${btoa(binary)}`
  }
  toFile(filename?: string) {
    filename = filename || `file.${this.mimeType.split('/')[1]}`
    const blob = new Blob([this.data], { type: this.mimeType })
    return new File([blob], filename, { type: this.mimeType })
  }
  toBlob() {
    const blob = new Blob([this.data], { type: this.mimeType })
    return blob
  }
  toRaw() {
    return this.data
  }
  size(): number {
    return this.data.length
  }
}

interface Pool {
  idle: boolean
  worker: Worker
}

interface Task {
  file: FB
  config: CompressConfig | undefined
  reslove: (value: ImageData) => void
  reject: (reason?: any) => void
}

/**
 * 创建图片压缩任务池
 * 可以创建1-5个worker来同时压缩图片
 * 并行压缩图片，加快图片压缩
 */
export class WorkerManager {
  private workerNmu = 3
  private workerPool: Pool[] = []
  private isReady = false
  private taskQueue: Task[] = []

  constructor(num?: number) {
    if (typeof num === 'number' && num >= 1 && num <= 5) {
      this.workerNmu = num
    }

    const creator: Promise<Pool>[] = new Array(this.workerNmu).fill(0).map(async () => {
      return {
        idle: true,
        worker: await loadWorker()
      }
    })

    Promise.all(creator).then(workers => {
      this.workerPool = workers.map(worker => {
        return new Proxy(worker, {
          set: (obj, props, value) => {
            if (props === 'idle' && value && this.taskQueue.length > 0) {
              this.exec(this.taskQueue.shift() as Task, obj)
            }
            return Reflect.set(obj, props, value)
          }
        })
      })
      this.isReady = true
      if (this.taskQueue.length > 0) {
        const pool = this.workerPool.find(pool => pool.idle)
        pool && this.exec(this.taskQueue.shift() as Task, pool)
      }
    })
  }

  compress(file: FB, config?: CompressConfig): Promise<ImageData> {
    return new Promise(async (reslove, reject) => {
      if (!this.isReady) {
        // not ready add to the queue
        this.queue(file, config, reslove, reject)
        return
      }
      // find an idle worker
      const pool = this.workerPool.find(pool => pool.idle)

      if (pool) {
        pool.idle = false
        try {
          reslove(await compress(file, config, pool.worker))
          pool.idle = true
        } catch (error) {
          reject(error)
          pool.idle = true
        }
      } else {
        this.queue(file, config, reslove, reject)
      }
    })
  }

  /**
   * add task to the task queue
   * @param file
   * @param config
   * @param reslove
   * @param reject
   */
  private queue(
    file: FB,
    config: CompressConfig | undefined,
    reslove: (value: ImageData) => void,
    reject: (reason?: any) => void
  ) {
    this.taskQueue.push({
      file,
      config,
      reslove,
      reject
    })
  }

  /**
   * exec the task
   * @param task
   * @param pool
   */
  private async exec(task: Task, pool: Pool) {
    try {
      task.reslove(await compress(task.file, task.config, pool.worker))
      pool.idle = true
    } catch (error) {
      task.reject(error)
      pool.idle = true
    }
  }

  /**
   * stop all wokers
   */
  kill() {
    this.workerPool.forEach(pool => {
      pool.worker.terminate()
      pool.idle = false
    })
  }
}
