<template>
    <div class="min-h-screen bg-gray-50">
        <!-- 顶部导航栏 -->
        <Header />

        <!-- 地址管理主体 -->
        <div class="max-w-7xl mx-auto p-6">
            <div class="bg-white rounded-lg shadow-md p-6">
                <!-- 标题和新增按钮 -->
                <div class="flex items-center justify-between mb-6">
                    <h1 class="text-2xl font-bold text-gray-800">我的收货地址</h1>
                    <el-button type="primary" @click="handleAdd" :loading="loading">
                        <el-icon class="mr-1">
                            <Plus />
                        </el-icon>
                        添加新地址
                    </el-button>
                </div>

                <!-- 加载中状态 -->
                <div v-if="loading && addressList.length === 0" class="text-center py-20">
                    <el-icon class="text-4xl">
                        <Loading />
                    </el-icon>
                    <p class="mt-4 text-gray-500">加载中...</p>
                </div>

                <!-- 地址列表 -->
                <div v-else-if="addressList.length > 0" class="space-y-4">
                    <div
                        v-for="address in addressList"
                        :key="address.id"
                        class="border border-gray-200 rounded-lg p-4 hover:border-blue-400 transition"
                    >
                        <div class="flex items-start justify-between">
                            <div class="flex-1 grid grid-cols-4 gap-4">
                                <!-- 收货人 -->
                                <div>
                                    <div class="text-sm text-gray-500 mb-1">收货人</div>
                                    <div class="text-gray-900 font-medium">
                                        {{ address.receiver }}
                                    </div>
                                </div>

                                <!-- 所在地区 -->
                                <div>
                                    <div class="text-sm text-gray-500 mb-1">所在地区</div>
                                    <div class="text-gray-900">
                                        {{ address.regionCode }}
                                    </div>
                                </div>

                                <!-- 详细地址 -->
                                <div>
                                    <div class="text-sm text-gray-500 mb-1">详细地址</div>
                                    <div class="text-gray-900">{{ address.detail }}</div>
                                </div>

                                <!-- 邮编 -->
                                <div>
                                    <div class="text-sm text-gray-500 mb-1">邮编</div>
                                    <div class="text-gray-900">{{ address.zipCode }}</div>
                                </div>
                            </div>

                            <!-- 操作按钮 -->
                            <div class="ml-6 flex items-center space-x-2">
                                <el-button
                                    type="primary"
                                    circle
                                    size="small"
                                    @click="handleEdit(address)"
                                >
                                    <el-icon>
                                        <Edit />
                                    </el-icon>
                                </el-button>
                                <el-button
                                    type="danger"
                                    circle
                                    size="small"
                                    @click="handleDelete(address.id)"
                                >
                                    <el-icon>
                                        <Delete />
                                    </el-icon>
                                </el-button>
                            </div>
                        </div>

                        <!-- 联系电话和默认地址 -->
                        <div class="flex items-center justify-between mt-3 pt-3 border-t">
                            <div class="text-gray-600">
                                联系电话：<span class="text-gray-900">{{ address.phone }}</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <el-switch
                                    v-model="address.isDefault"
                                    active-text="默认"
                                    @change="handleSetDefault(address.id)"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 空状态 -->
                <div v-else class="text-center py-20">
                    <el-icon class="text-6xl text-gray-300 mb-4">
                        <Location />
                    </el-icon>
                    <p class="text-gray-400 mb-4">暂无收货地址</p>
                </div>
            </div>
        </div>

        <!-- 新增/编辑地址对话框 -->
        <el-dialog
            v-model="dialogVisible"
            :title="dialogTitle"
            width="600px"
            @close="handleDialogClose"
        >
            <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
                <el-form-item label="收货人" prop="receiver">
                    <el-input v-model="formData.receiver" placeholder="请输入收货人姓名" />
                </el-form-item>

                <el-form-item label="所在地区" prop="regionCode">
                    <el-input
                        v-model="formData.regionCode"
                        placeholder="请输入所在地区，如省/市/区"
                    />
                </el-form-item>

                <el-form-item label="详细地址" prop="detail">
                    <el-input
                        v-model="formData.detail"
                        type="textarea"
                        :rows="3"
                        placeholder="请输入详细地址"
                    />
                </el-form-item>

                <el-form-item label="邮编" prop="zipCode">
                    <el-input v-model="formData.zipCode" placeholder="请输入邮编" />
                </el-form-item>

                <el-form-item label="联系电话" prop="phone">
                    <el-input v-model="formData.phone" placeholder="请输入联系电话" />
                </el-form-item>

                <el-form-item label="默认地址">
                    <el-switch v-model="formData.isDefault" />
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="flex justify-end gap-2">
                    <el-button @click="dialogVisible = false" :disabled="submitting">
                        取消
                    </el-button>
                    <el-button type="primary" @click="handleSubmit" :loading="submitting">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
    import { ref, reactive, onMounted } from 'vue'
    import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
    import { Plus, Edit, Delete, Location, Loading } from '@element-plus/icons-vue'
    import Header from '@/views/home/model/Header.vue'
    import {
        fetchAddressList,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        type Address,
    } from '@/api/address'
    import { getRegionPath } from '@/utils/china-region-data'

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

    // 加载地址列表
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

    // 新增地址
    const handleAdd = () => {
        dialogTitle.value = '新增收货地址'
        isEdit.value = false
        currentEditId.value = null
        resetForm()
        dialogVisible.value = true
    }

    // 编辑地址
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

    // 删除地址
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
            // 用户取消删除或出错
            if (error instanceof Error && error.message !== 'cancel') {
                console.error('删除地址失败:', error)
                ElMessage.error('删除地址失败')
            }
        }
    }

    // 设置默认地址
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

    // 提交表单
    const handleSubmit = async () => {
        if (!formRef.value) return

        await formRef.value.validate(async (valid) => {
            if (!valid) return

            try {
                submitting.value = true

                if (isEdit.value && currentEditId.value) {
                    console.log('编辑模式, adress ID:', currentEditId.value)
                    await updateAddress(currentEditId.value, formData)
                    ElMessage.success('修改成功')
                } else {
                    // 新增模式
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

    // 重置表单
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

    // 对话框关闭
    const handleDialogClose = () => {
        resetForm()
    }

    onMounted(() => {
        loadAddressList()
    })
</script>

<style scoped>
    :deep(.el-switch__label) {
        font-size: 14px;
    }
</style>
