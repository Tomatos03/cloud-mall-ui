import http from '@/utils/http'

/**
 * 通用上传接口返回结果
 */
export interface UploadResult {
    /**
     * 文件访问相对路径
     */
    url: string
}

/**
 * 上传图片 - POST /common/upload/image
 * @param file 图片文件
 * @returns 上传结果，包含图片相对路径
 */
export function uploadImage(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    return http.post<UploadResult>('/common/upload/image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}