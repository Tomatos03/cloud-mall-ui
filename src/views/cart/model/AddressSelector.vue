<template>
    <div class="address-section">
        <!-- 头部：标题与操作 -->
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2 text-gray-800">
                <el-icon :size="18" class="text-orange-500"><Location /></el-icon>
                <span class="text-base font-bold">收货地址</span>
            </div>
            <el-button
                type="primary"
                link
                class="text-orange-500! font-medium"
                @click="showAddressDialog = true"
            >
                {{ modelValue ? '修改地址' : '添加地址' }}
                <el-icon class="ml-1"><ArrowRight /></el-icon>
            </el-button>
        </div>

        <!-- 地址展示区域 -->
        <div v-if="modelValue" class="address-display-card">
            <div class="flex items-baseline gap-3 mb-2">
                <span class="text-lg font-bold text-gray-900">{{ modelValue.receiver }}</span>
                <span class="text-gray-500 font-medium">{{ modelValue.phone }}</span>
                <el-tag v-if="modelValue.isDefault" size="small" effect="plain" type="warning" class="rounded-md">默认</el-tag>
            </div>
            <div class="text-sm text-gray-600 leading-relaxed">
                <p class="mb-1">
                    <span class="text-gray-400 mr-1">{{ getRegionPath(String(modelValue.regionCode)) }}</span>
                    {{ modelValue.detail }}
                </p>
                <p class="text-gray-400 text-xs">邮政编码：{{ modelValue.zipCode }}</p>
            </div>
        </div>

        <!-- 未选择状态 -->
        <div v-else class="empty-address-placeholder" @click="showAddressDialog = true">
            <el-icon :size="20" class="mb-1"><Plus /></el-icon>
            <span>请选择收货地址</span>
        </div>

        <!-- 地址选择对话框 -->
        <el-dialog
            v-model="showAddressDialog"
            title="选择收货地址"
            width="560px"
            append-to-body
            destroy-on-close
            class="minimal-dialog"
        >
            <div class="address-list custom-scrollbar">
                <div
                    v-for="address in addressList"
                    :key="address.id"
                    class="address-item"
                    :class="{ 'is-active': tempSelectedAddress?.id === address.id }"
                    @click="tempSelectedAddress = address"
                >
                    <div class="flex items-start gap-3">
                        <div class="mt-1">
                            <div class="custom-radio" :class="{ 'checked': tempSelectedAddress?.id === address.id }"></div>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2 mb-1">
                                <span class="font-bold text-gray-900">{{ address.receiver }}</span>
                                <span class="text-gray-500 text-sm">{{ address.phone }}</span>
                                <span v-if="address.isDefault" class="text-[10px] px-1.5 py-0.5 bg-orange-50 text-orange-500 border border-orange-100 rounded">默认</span>
                            </div>
                            <p class="text-sm text-gray-600 truncate-2-lines mb-1">
                                <span class="text-gray-400 mr-1">{{ getRegionPath(String(address.regionCode)) }}</span>
                                {{ address.detail }}
                            </p>
                            <p class="text-xs text-gray-400">邮编：{{ address.zipCode }}</p>
                        </div>
                    </div>
                </div>

                <div v-if="addressList.length === 0" class="py-12 text-center">
                    <el-empty description="暂无收货地址" :image-size="80" />
                </div>
            </div>

            <template #footer>
                <div class="flex items-center justify-between pt-2">
                    <el-button link type="primary" @click="goToAddressManagement">
                        <el-icon class="mr-1"><Setting /></el-icon>管理地址
                    </el-button>
                    <div class="flex gap-2">
                        <el-button @click="showAddressDialog = false">取消</el-button>
                        <el-button type="primary" class="bg-orange-500! border-orange-500!" @click="confirmAddress" :disabled="!tempSelectedAddress">
                            确认选择
                        </el-button>
                    </div>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Location, ArrowRight, Plus, Setting } from '@element-plus/icons-vue'
import { fetchAddressList, type Address } from '@/api/address'
import { getRegionPath } from '@/utils/china-region-data'

const props = defineProps<{
    modelValue: Address | null
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', address: Address | null): void
}>()

const router = useRouter()
const addressList = ref<Address[]>([])
const showAddressDialog = ref(false)
const tempSelectedAddress = ref<Address | null>(null)

watch(showAddressDialog, (val) => {
    if (val) {
        tempSelectedAddress.value = props.modelValue
    }
})

const loadAddressList = async () => {
    try {
        const res = await fetchAddressList()
        addressList.value = res.data

        if (!props.modelValue && addressList.value.length > 0) {
            const defaultAddress = addressList.value.find(addr => addr.isDefault)
            emit('update:modelValue', defaultAddress || addressList.value[0])
        }
    } catch (err) {
        console.error('Failed to load addresses:', err)
    }
}

const confirmAddress = () => {
    emit('update:modelValue', tempSelectedAddress.value)
    showAddressDialog.value = false
}

const goToAddressManagement = () => {
    showAddressDialog.value = false
    router.push('/profile?tab=address')
}

onMounted(() => {
    loadAddressList()
})
</script>

<style scoped>
@reference "@/styles/index.css";

.address-section {
    @apply bg-white rounded-xl border border-gray-100 p-5;
}

.address-display-card {
    @apply bg-gray-50/50 rounded-lg p-4 border border-gray-100;
}

.empty-address-placeholder {
    @apply h-24 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-orange-200 hover:text-orange-400 transition-all;
}

.address-list {
    @apply max-h-100 overflow-y-auto pr-2;
}

.address-item {
    @apply p-4 mb-3 rounded-lg border border-gray-100 cursor-pointer transition-all hover:bg-gray-50;
}

.address-item.is-active {
    @apply border-orange-500 bg-orange-50/30;
}

.custom-radio {
    @apply w-4 h-4 rounded-full border border-gray-300 relative flex items-center justify-center bg-white;
}

.checked.custom-radio {
    @apply border-orange-500;
}

.checked.custom-radio::after {
    content: '';
    @apply w-2 h-2 bg-orange-500 rounded-full;
}

.truncate-2-lines {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

:deep(.minimal-dialog) {
    @apply rounded-2xl;
}

:deep(.minimal-dialog .el-dialog__header) {
    @apply border-b border-gray-50 pb-4 mb-0;
}

:deep(.minimal-dialog .el-dialog__title) {
    @apply text-base font-bold;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-gray-200 rounded-full;
}
.custom-scrollbar::-webkit-scrollbar-track {
    @apply bg-transparent;
}
</style>
