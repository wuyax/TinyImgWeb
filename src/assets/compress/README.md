# Comprossor 图片压缩工具

高性能端侧图片压缩工具。图片压缩率 **50% ～ 80%** ，占用系统资源少，支持多线程压缩，加快压缩速度。该工具支持`png`, `jpg`,`webp` 的压缩。

## 基础使用方法

```js
import { compress } from '@/assets/compress/index'

function fileChange(event: any) {
  const file = event.target.files[0]
  if (file) {
    const sourthFileSize = file.size
    compress(file, { quality: 75, keepMetadata: true })
      .then(imgData => {
        const b64Img = imgData.toBase64()
        const size = imgData.size()
        const ratio = (((sourthFileSize - size) / sourthFileSize) * 100).toFixed(2)
        console.log(sourthFileSize, size)
      })
      .catch(errCode => {
        console.log(errCode)
      })
  }
}
```

## 多线程压缩

多线程压缩提供了一个任务管理器，用户可以最多同时压缩 5 张图片，提升效率。

```js
import { WorkerManager } from '@/assets/compress/index'

const WM = new WorkerManager(5)

function handleDrop(e) {
  const dt = e.dataTransfer
  const files = dt.files

  Array.from(files as File[]).map(file => {
    WM.compress(file).then(imgData => {
      const b64Img = imgData.toBase64()
      const raw = imgData.toRaw()
      const file = imgData.toFile('test.png')
      const size = imgData.size()

      console.log(size, b64Img)
    })
  })
}

// 删除 workers
WM.kill()
```
