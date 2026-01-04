import http from '@/utils/http'

/**
 * 收货地址类型
 */
export interface Address {
    id: string
    /** 收货人 */
    receiver: string
    /** 地区代码（最后一级行政区代码） */
    regionCode: string
    /** 详细地址 */
    detail: string
    /** 邮编 */
    zipCode: string
    fullAddress: string
    /** 联系电话 */
    phone: string
    /** 是否默认地址 */
    isDefault: boolean
}

export type AddressFormData = Omit<Address, 'fullAddress'>

/**
 * 获取收货地址列表
 */
export function fetchAddressList() {
    return http.get<Address[]>('/address')
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
export function updateAddress(id: string | number, data: Omit<Address, 'id'>) {
    return http.put<Address>(`/address/${id}`, data)
}

/**
 * 删除收货地址
 */
export function deleteAddress(id: string | number) {
    return http.delete(`/address/${id}`)
}

/**
 * 设置默认地址
 */
export function setDefaultAddress(id: string | number) {
    return http.put(`/address/setDefault/${id}`)
}
