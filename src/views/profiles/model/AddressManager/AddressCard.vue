<template>
    <div class="group relative border border-gray-100 rounded-2xl p-6 hover:border-orange-300 hover:shadow-xl hover:shadow-gray-100 transition-all duration-300 bg-white">
        <!-- 默认地址标记 -->
        <div
            v-if="address.isDefault"
            class="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-3 py-1 rounded-full shadow-md z-10"
        >
            默认地址
        </div>

        <div class="flex flex-col h-full">
            <!-- 头部：收货人和电话 -->
            <div class="flex justify-between items-start mb-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                        <el-icon :size="20"><User /></el-icon>
                    </div>
                    <div>
                        <div class="text-lg font-bold text-gray-900">
                            {{ address.receiver }}
                        </div>
                        <div class="text-sm text-gray-500">
                            {{ address.phone }}
                        </div>
                    </div>
                </div>

                <!-- 操作按钮 -->
                <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <el-button
                        type="primary"
                        plain
                        circle
                        size="small"
                        class="border-orange-200! text-orange-500! hover:bg-orange-500! hover:text-white!"
                        @click="$emit('edit')"
                    >
                        <el-icon><Edit /></el-icon>
                    </el-button>
                    <el-button
                        type="danger"
                        plain
                        circle
                        size="small"
                        @click="$emit('delete')"
                    >
                        <el-icon><Delete /></el-icon>
                    </el-button>
                </div>
            </div>

            <!-- 地址信息 -->
            <div class="space-y-3 flex-1">
                <div class="flex items-start gap-2">
                    <el-icon class="mt-1 text-gray-400"><Location /></el-icon>
                    <div class="text-gray-600 leading-relaxed">
                        <span v-if="address.regionCode" class="font-medium text-gray-800">
                            {{ address.fullAddress }}
                        </span>
                        <span v-else class="font-medium text-gray-400">未设置地区</span>
                        <p class="mt-1">{{ address.detail }}</p>
                    </div>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-400">
                    <el-icon><Postcard /></el-icon>
                    <span>邮编：{{ address.zipCode }}</span>
                </div>
            </div>

            <!-- 底部操作 -->
            <div class="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <el-switch
                        :model-value="address.isDefault"
                        active-color="#f97316"
                        @change="$emit('setDefault')"
                    />
                    <span class="text-sm text-gray-500">设为默认</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Edit, Delete, Location, User, Postcard } from '@element-plus/icons-vue'
import type { Address } from '@/api/address'

defineProps<{
    address: Address
}>()

defineEmits<{
    edit: []
    delete: []
    setDefault: []
}>()
</script>