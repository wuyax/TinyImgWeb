export enum Status {
  compressing,
  success,
  error
}

export interface ImgInfo {
  id: any
  name: string
  type: string
  status: Status
  thumb?: string
  rawSize: number
  resultSize: number
  rawData: File
  resultData: any
}
