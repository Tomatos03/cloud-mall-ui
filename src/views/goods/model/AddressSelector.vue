```vue /home/Tomatos/Projects/design/oneline-shop-buyer/src/views/goods/model/AddressSelector.vue
<template>
    <el-dialog
        v-model="visible"
        title="选择收货地址"
        width="500px"
        append-to-body
        class="address-dialog"
    >
        <div v-loading="loading" class="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            <div
                v-for="item in sortedAddressList"
                :key="item.id"
                class="p-4 mb-3 border rounded-xl cursor-pointer transition-all hover:border-orange-300 group relative"
                :class="
                    tempSelected?.id === item.id
                        ? 'border-orange-500 bg-orange-50/30'
                        : 'border-gray-100'
                "
                @click="handleSelect(item)"
            >
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2">
                        <span class="font-bold text-gray-800">{{ item.receiver }}</span>
                        <span class="text-gray-500 text-sm">{{ item.phone }}</span>
                        <el-tag
                            v-if="item.isDefault"
                            size="small"
                            type="danger"
                            effect="plain"
                            class="rounded-md border-red-100! text-red-500! bg-red-50!"
                            >默认</el-tag
                        >
                    </div>
                    <el-icon v-if="tempSelected?.id === item.id" class="text-orange-500" :size="20">
                        <CircleCheckFilled />
                    </el-icon>
                </div>
                <div class="text-sm text-gray-600 leading-relaxed">
                    {{ item.detail }}
                </div>
            </div>

            <div
                v-if="!loading && sortedAddressList.length === 0"
                class="py-10 text-center text-gray-400"
            >
                <el-icon :size="40" class="mb-2"><Location /></el-icon>
                <p>暂无收货地址</p>
            </div>
        </div>
        <template #footer>
            <div class="flex justify-end gap-3">
                <el-button class="rounded-lg!" @click="visible = false">取消</el-button>
                <el-button
                    type="primary"
                    class="bg-orange-500! border-orange-500! rounded-lg!"
                    @click="handleConfirm"
                >
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
    import { ref, computed, watch } from 'vue'
    import { CircleCheckFilled, Location } from '@element-plus/icons-vue'
    import { fetchAddressList, type Address } from '@/api/address'

    const props = defineProps<{
        modelValue: Address | null
    }>()

    const emit = defineEmits<{
        (e: 'update:modelValue', value: Address | null): void
        (e: 'change', value: Address): void
    }>()

    const visible = defineModel<boolean>('visible', { default: false })
    const loading = ref(false)
    const addressList = ref<Address[]>([])
    const tempSelected = ref<Address | null>(null)

    const sortedAddressList = computed(() => {
        return [...addressList.value].sort((a, b) => {
            if (a.isDefault && !b.isDefault) return -1
            if (!a.isDefault && b.isDefault) return 1
            return 0
        })
    })

    const loadAddresses = async () => {
        loading.value = true
        try {
            const res = await fetchAddressList()
            addressList.value = res.data
            // 如果没有选中的地址，且列表不为空，默认选中第一个（排序后即为默认地址）
            if (!tempSelected.value && addressList.value.length > 0) {
                tempSelected.value = sortedAddressList.value[0]
            }
        } catch (error) {
            console.error('Failed to fetch addresses:', error)
        } finally {
            loading.value = false
        }
    }

    watch(visible, (val) => {
        if (val) {
            tempSelected.value = props.modelValue
            loadAddresses()
        }
    })

    const handleSelect = (item: Address) => {
        tempSelected.value = item
    }

    const handleConfirm = () => {
        emit('update:modelValue', tempSelected.value)
        if (tempSelected.value) {
            emit('change', tempSelected.value)
        }
        visible.value = false
    }
</script>

<style scoped>
    :deep(.el-dialog) {
        border-radius: 16px;
        overflow: hidden;
    }
    :deep(.el-dialog__header) {
        margin-right: 0;
        padding-bottom: 20px;
        border-bottom: 1px solid #f3f4f6;
    }
    :deep(.el-dialog__body) {
        padding-top: 20px;
    }
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #e5e7eb;
        border-radius: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background-color: transparent;
    }
</style>
