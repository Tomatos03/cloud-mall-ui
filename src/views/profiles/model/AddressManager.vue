<template>
    <div class="p-8">
        <!-- 标题和新增按钮 -->
        <div class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-3">
                <div class="w-2 h-8 bg-orange-500 rounded-full"></div>
                <h1 class="text-2xl font-bold text-gray-800 tracking-tight">
                    我的收货地址
                </h1>
            </div>
            <el-button
                type="primary"
                class="bg-orange-500! border-orange-500! hover:bg-orange-600! rounded-xl! h-11! px-6 font-bold shadow-lg shadow-orange-100 transition-all"
                @click="handleAdd"
                :loading="loading"
            >
                <el-icon class="mr-2 text-lg">
                    <Plus />
                </el-icon>
                添加新地址
            </el-button>
        </div>

        <!-- 加载中状态 -->
        <div
            v-if="loading && addressList.length === 0"
            class="flex flex-col items-center justify-center py-32"
        >
            <el-icon class="text-4xl text-orange-500 animate-spin">
                <Loading />
            </el-icon>
            <p class="mt-4 text-gray-400 font-medium">正在为您加载地址列表...</p>
        </div>

        <!-- 地址列表 -->
        <div
            v-else-if="addressList.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
            <div
                v-for="address in addressList"
                :key="address.id"
                class="group relative border border-gray-100 rounded-2xl p-6 hover:border-orange-300 hover:shadow-xl hover:shadow-gray-100 transition-all duration-300 bg-white"
            >
                <!-- 默认地址标记 -->
                <div
                    v-if="address.isDefault"
                    class="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-3 py-1 rounded-full shadow-md z-10"
                >
                    默认地址
                </div>

                <div class="flex flex-col h-full">
                    <div class="flex justify-between items-start mb-4">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500"
                            >
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
                        <div
                            class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <el-button
                                type="primary"
                                plain
                                circle
                                size="small"
                                class="border-orange-200! text-orange-500! hover:bg-orange-500! hover:text-white!"
                                @click="handleEdit(address)"
                            >
                                <el-icon><Edit /></el-icon>
                            </el-button>
                            <el-button
                                type="danger"
                                plain
                                circle
                                size="small"
                                @click="handleDelete(address.id)"
                            >
                                <el-icon><Delete /></el-icon>
                            </el-button>
                        </div>
                    </div>

                    <div class="space-y-3 flex-1">
                        <div class="flex items-start gap-2">
                            <el-icon class="mt-1 text-gray-400"><Location /></el-icon>
                            <div class="text-gray-600 leading-relaxed">
                                <span class="font-medium text-gray-800">{{
                                    address.regionCode
                                }}</span>
                                <p class="mt-1">{{ address.detail }}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 text-sm text-gray-400">
                            <el-icon><Postcard /></el-icon>
                            <span>邮编：{{ address.zipCode }}</span>
                        </div>
                    </div>

                    <!-- 底部操作 -->
                    <div
                        class="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between"
                    >
                        <div class="flex items-center gap-2">
                            <el-switch
                                v-model="address.isDefault"
                                active-color="#f97316"
                                @change="handleSetDefault(address.id)"
                            />
                            <span class="text-sm text-gray-500">设为默认</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="flex flex-col items-center justify-center py-32">
            <div
                class="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-6"
            >
                <el-icon class="text-5xl text-gray-200">
                    <Location />
                </el-icon>
            </div>
            <p class="text-gray-400 text-lg mb-6">您还没有添加收货地址哦</p>
            <el-button
                type="primary"
                plain
                class="border-orange-500! text-orange-500! hover:bg-orange-50! rounded-xl!"
                @click="handleAdd"
            >
                立即添加
            </el-button>
        </div>

        <!-- 新增/编辑地址对话框 -->
        <el-dialog
            v-model="dialogVisible"
            :title="dialogTitle"
            width="550px"
            class="address-dialog"
            @close="handleDialogClose"
            align-center
            destroy-on-close
            append-to-body
        >
            <el-form
                ref="formRef"
                :model="formData"
                :rules="formRules"
                label-position="top"
                class="px-4"
            >
                <div class="grid grid-cols-2 gap-4">
                    <el-form-item label="收货人" prop="receiver">
                        <el-input
                            v-model="formData.receiver"
                            placeholder="请输入姓名"
                            class="custom-input"
                        />
                    </el-form-item>
                    <el-form-item label="联系电话" prop="phone">
                        <el-input
                            v-model="formData.phone"
                            placeholder="请输入手机号"
                            class="custom-input"
                        />
                    </el-form-item>
                </div>

                <el-form-item label="所在地区" prop="regionCode">
                    <AddressPicker
                        :region-code="formData.regionCode"
                        @change="(code) => (formData.regionCode = code)"
                        class="w-full!"
                    />
                </el-form-item>

                <el-form-item label="详细地址" prop="detail">
                    <el-input
                        v-model="formData.detail"
                        type="textarea"
                        :rows="3"
                        placeholder="请输入街道、楼牌号等详细信息"
                        class="custom-input"
                    />
                </el-form-item>

                <div class="grid grid-cols-2 gap-4 items-end">
                    <el-form-item label="邮政编码" prop="zipCode">
                        <el-input
                            v-model="formData.zipCode"
                            placeholder="请输入邮编"
                            class="custom-input"
                        />
                    </el-form-item>
                    <el-form-item label="设为默认地址">
                        <div class="h-10 flex items-center">
                            <el-switch v-model="formData.isDefault" active-color="#f97316" />
                        </div>
                    </el-form-item>
                </div>
            </el-form>

            <template #footer>
                <div class="flex justify-end gap-3 px-4 pb-4">
                    <el-button
                        @click="dialogVisible = false"
                        :disabled="submitting"
                        class="rounded-xl! px-6"
                    >
                        取消
                    </el-button>
                    <el-button
                        type="primary"
                        @click="handleSubmit"
                        :loading="submitting"
                        class="bg-orange-500! border-orange-500! hover:bg-orange-600! rounded-xl! px-8 font-bold"
                    >
                        保存地址
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
    import { ref, reactive, onMounted } from 'vue'
    import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
    import { Plus, Edit, Delete, Location, Loading, User, Postcard } from '@element-plus/icons-vue'
    import AddressPicker from './AddressPicker.vue'
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
    const dialogTitle = ref('新增收货地址')
    const isEdit = ref(false)
    const currentEditId = ref<number | null>(null)
    const formRef = ref<FormInstance>()

    const formData = reactive<Omit<Address, 'id'>>({
        receiver: '',
        regionCode: '',
        detail: '',
        zipCode: '',
        phone: '',
        isDefault: false,
    })

    const formRules: FormRules = {
        receiver: [{ required: true, message: '请输入收货人姓名', trigger: 'blur' }],
        regionCode: [{ required: true, message: '请输入所在地区', trigger: 'blur' }],
        detail: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        zipCode: [
            { required: true, message: '请输入邮编', trigger: 'blur' },
            {
                pattern: /^\d{6}$/,
                message: '请输入正确的邮编格式',
                trigger: 'blur',
            },
        ],
        phone: [
            { required: true, message: '请输入联系电话', trigger: 'blur' },
            {
                pattern: /^1[3-9]\d{9}$/,
                message: '请输入正确的手机号码',
                trigger: 'blur',
            },
        ],
    }

    const loadAddressList = async () => {
        try {
            loading.value = true
            const res = await fetchAddressList()
            addressList.value = res.data || []
        } catch (error) {
            console.error('加载地址列表失败:', error)
            ElMessage.error('加载地址列表失败')
        } finally {
            loading.value = false
        }
    }

    const handleAdd = () => {
        dialogTitle.value = '新增收货地址'
        isEdit.value = false
        currentEditId.value = null
        resetForm()
        dialogVisible.value = true
    }

    const handleEdit = (address: Address) => {
        dialogTitle.value = '编辑收货地址'
        isEdit.value = true
        currentEditId.value = address.id
        Object.assign(formData, {
            receiver: address.receiver,
            regionCode: address.regionCode || '',
            detail: address.detail,
            zipCode: address.zipCode,
            phone: address.phone,
            isDefault: address.isDefault,
        })
        dialogVisible.value = true
    }

    const handleDelete = async (id: number) => {
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

    const handleSetDefault = async (id: number) => {
        try {
            await setDefaultAddress(id)
            ElMessage.success('设置成功')
            await loadAddressList()
        } catch (error) {
            console.error('设置默认地址失败:', error)
            ElMessage.error('设置默认地址失败')
        }
    }

    const handleSubmit = async () => {
        if (!formRef.value) return

        await formRef.value.validate(async (valid) => {
            if (!valid) return

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
        })
    }

    const resetForm = () => {
        Object.assign(formData, {
            receiver: '',
            regionCode: '',
            detail: '',
            zipCode: '',
            phone: '',
            isDefault: false,
        })
        formRef.value?.clearValidate()
    }

    const handleDialogClose = () => {
        resetForm()
    }

    onMounted(() => {
        loadAddressList()
    })
</script>

<style scoped>
    :deep(.address-dialog) {
        border-radius: 24px;
        overflow: hidden;
    }

    :deep(.address-dialog .el-dialog__header) {
        margin-right: 0;
        padding: 24px 24px 10px;
    }

    :deep(.address-dialog .el-dialog__title) {
        font-weight: 800;
        color: #1f2937;
    }

    :deep(.custom-input .el-input__wrapper) {
        border-radius: 12px;
        padding: 4px 12px;
        box-shadow: 0 0 0 1px #f3f4f6 inset;
    }

    :deep(.custom-input .el-input__wrapper.is-focus) {
        box-shadow: 0 0 0 1px #f97316 inset !important;
    }

    :deep(.custom-input .el-textarea__inner) {
        border-radius: 12px;
        padding: 12px;
        box-shadow: 0 0 0 1px #f3f4f6 inset;
    }

    :deep(.custom-input .el-textarea__inner:focus) {
        box-shadow: 0 0 0 1px #f97316 inset !important;
    }
</style>