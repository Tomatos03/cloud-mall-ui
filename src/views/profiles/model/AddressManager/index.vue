<template>
    <div class="p-8">
        <!-- 标题和新增按钮 -->
        <AddressHeader :loading="loading" @add="handleAdd" />

        <!-- 加载中状态 -->
        <AddressLoading :loading="loading" :address-count="addressList.length" />

        <!-- 地址卡片 -->
        <template v-if="addressList.length > 0">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AddressCard
                    v-for="address in addressList"
                    :key="address.id"
                    :address="address"
                    @edit="handleEdit(address)"
                    @delete="handleDelete(address.id)"
                    @setDefault="handleSetDefault(address.id)"
                />
            </div>
        </template>

        <!-- 空状态 -->
        <AddressEmpty
            v-if="!loading && addressList.length === 0"
            :isEmpty="addressList.length === 0"
            @add="handleAdd"
        />

        <!-- 新增/编辑地址对话框 -->
        <AddressFormDialog
            :visible="dialogVisible"
            :title="dialogTitle"
            :initial-data="editingData"
            :submitting="submitting"
            @submit="handleSubmit"
            @close="handleDialogClose"
            @update:visible="dialogVisible = $event"
        />
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import AddressHeader from './AddressHeader.vue'
    import AddressLoading from './AddressLoading.vue'
    import AddressCard from './AddressCard.vue'
    import AddressEmpty from './AddressEmpty.vue'
    import AddressFormDialog from './AddressFormDialog.vue'
    import {
        fetchAddressList,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        type Address,
    } from '@/api/address'

    const addressList = ref<Address[]>([])
    const loading = ref(false)
    const submitting = ref(false)
    const dialogVisible = ref(false)
    const isEdit = ref(false)
    const currentEditId = ref<string | null>(null)

    const dialogTitle = computed(() => (isEdit.value ? '编辑收货地址' : '新增收货地址'))

    const editingData = computed(() => {
        if (!isEdit.value) return undefined

        return addressList.value.find((address) => address.id === currentEditId.value)
    })

    const loadAddressList = async () => {
        try {
            loading.value = true
            const res = await fetchAddressList()
            addressList.value = res.data || []
        } finally {
            loading.value = false
        }
    }

    const handleAdd = () => {
        isEdit.value = false
        currentEditId.value = null
        dialogVisible.value = true
    }

    const handleEdit = (address: Address) => {
        isEdit.value = true
        currentEditId.value = address.id
        dialogVisible.value = true
    }

    const handleDelete = async (id: string | number) => {
        try {
            await ElMessageBox.confirm('确定要删除这个收货地址吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })

            await deleteAddress(id)
            ElMessage.success('删除成功')
            await loadAddressList()
        } catch (error) {
            if (error instanceof Error && error.message !== 'cancel') {
                console.error('删除地址失败:', error)
                ElMessage.error('删除地址失败')
            }
        }
    }

    const handleSetDefault = async (id: string | number) => {
        try {
            await setDefaultAddress(id)
            ElMessage.success('设置成功')
            await loadAddressList()
        } catch (error) {
            console.error('设置默认地址失败:', error)
            ElMessage.error('设置默认地址失败')
        }
    }

    const handleSubmit = async (formData: Address) => {
        try {
            submitting.value = true

            if (isEdit.value && currentEditId.value) {
                await updateAddress(currentEditId.value, formData)
                ElMessage.success('修改成功')
            } else {
                await addAddress(formData)
                ElMessage.success('添加成功')
            }

            await loadAddressList()
            dialogVisible.value = false
        } catch (error) {
            console.error('操作失败:', error)
            ElMessage.error('操作失败')
        } finally {
            submitting.value = false
        }
    }

    const handleDialogClose = () => {
        isEdit.value = false
        currentEditId.value = null
    }

    onMounted(() => {
        loadAddressList()
    })
</script>
