export enum Status {
  compressing,
  success,
  error,
  unsupport
}

export interface ImgInfo {
  uid: any
  name: string
  type: string
  status: Status
  thumb?: string
  rawSize: number
  resultSize: number
  rawData: File
  resultData: any
}

interface TreeNode {
  readonly id: number
  readonly pid: number
  readonly uid: string
  rfn: string
  name: string
  directory: boolean
  status: Status
  rawSize: number
  resultSize: number
  rawData: File
  resultData: any
  children?: TreeNode[]
}
