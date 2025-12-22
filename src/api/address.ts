import http from '@/utils/http'

/**
 * 收货地址类型
 */
export interface Address {
    id: number
    /** 收货人 */
    receiver: string
    /** 地区代码（最后一级行政区代码） */
    regionCode: string
    /** 详细地址 */
    detail: string
    /** 邮编 */
    zipCode: string
    /** 联系电话 */
    phone: string
    /** 是否默认地址 */
    isDefault: boolean
}

/**
 * 获取收货地址列表
 */
export function fetchAddressList() {
    return http.get<Address[]>('/address/list')
}

/**
 * 新增收货地址
 */
export function addAddress(data: Omit<Address, 'id'>) {
    return http.post<Address>('/address/add', data)
}

/**
 * 更新收货地址
 */
export function updateAddress(id: number, data: Omit<Address, 'id'>) {
    return http.put<Address>(`/address/${id}`, data)
}

/**
 * 删除收货地址
 */
export function deleteAddress(id: number) {
    return http.delete(`/address/${id}`)
}

/**
 * 设置默认地址
 */
export function setDefaultAddress(id: number) {
    return http.put(`/address/setDefault/${id}`)
}
