<template>
    <el-dialog
        v-model="dialogVisible"
        :title="title"
        width="550px"
        class="address-dialog"
        @close="$emit('close')"
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
</template>

<script setup lang="ts">
    import { ref, reactive, watch } from 'vue'
    import AddressPicker from '../AddressPicker.vue'
    import type { FormRules } from 'element-plus/lib/components/index.js'
    import type { Address } from '@/api/address'
    import { getRegionPath } from '@/utils/china-region-data'

    interface Props {
        visible: boolean
        title: string
        initialData?: Address
        submitting: boolean
    }

    const props = withDefaults(defineProps<Props>(), {
        visible: false,
        title: '新增收货地址',
        submitting: false,
    })

    const emit = defineEmits<{
        (e: 'submit', data: Address): void
        (e: 'close'): void
        (e: 'update:visible', visible: boolean): void
    }>()

    const dialogVisible = ref(props.visible)
    const formRef = ref()
    const defaultFormData: Address = {
        id: '',
        receiver: '',
        regionCode: '',
        fullAddress: '',
        detail: '',
        zipCode: '',
        phone: '',
        isDefault: false,
    }
    const formData = reactive<Address>(defaultFormData)

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

    watch(
        () => props.visible,
        (newVal) => {
            dialogVisible.value = newVal
        },
    )

    watch(
        () => dialogVisible.value,
        (newVal) => {
            emit('update:visible', newVal)
        },
    )

    watch(
        () => props.initialData,
        (newVal) => {
            if (newVal) {
                Object.assign(formData, newVal)
            }
        },
        { deep: true },
    )

    const resetForm = () => {
        Object.assign(formData, defaultFormData)
        formRef.value?.clearValidate()
    }

    const handleSubmit = async () => {
        if (!formRef.value) return

        await formRef.value.validate(async (valid: unknown) => {
            if (!valid) return

            formData.fullAddress = getRegionPath(formData.regionCode)
            emit('submit', formData)
        })
    }

    defineExpose({
        resetForm,
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
