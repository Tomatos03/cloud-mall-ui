<script setup lang="ts">
    import { ref, watch } from 'vue'
    import { ElMessage } from 'element-plus'
    import { Check, Wallet, CreditCard, CircleCheckFilled, Loading } from '@element-plus/icons-vue'
    import { getPaymentStatus } from '@/api/order'

    const props = defineProps<{
        visible: boolean
        amount: number
        orderNo: string
        quantity: number
    }>()

    const emit = defineEmits(['update:visible', 'success'])

    // 支付步骤枚举
    enum PayStep {
        SELECT = 'select',   // 选择支付方式
        QRCODE = 'qrcode',   // 扫码支付
        SUCCESS = 'success'  // 支付成功
    }

    const paymentMethods = [
        {
            id: 'wechat',
            name: '微信支付',
            icon: Wallet,
            color: '#07C160',
            bg: '#F0F9F4',
            qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=weixin://wxpay/bizpayurl?pr=mock_wechat_pay'
        },
        {
            id: 'alipay',
            name: '支付宝支付',
            icon: CreditCard,
            color: '#1677FF',
            bg: '#F0F5FF',
            qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://qr.alipay.com/mock_alipay_pay'
        },
    ]

    const currentStep = ref<PayStep>(PayStep.SELECT)
    const selectedMethod = ref('wechat')
    const loading = ref(false)

    // 监听显示状态，打开时重置状态
    watch(
        () => props.visible,
        (val) => {
            if (val) {
                currentStep.value = PayStep.SELECT
                loading.value = false
            }
        },
    )

    const handleClose = () => {
        emit('update:visible', false)
    }

    // 第一步：确认支付方式，进入扫码
    const handleGoToPay = () => {
        currentStep.value = PayStep.QRCODE
    }

    // 第二步：确认支付（用户扫码后点击"我已支付"）
    const handleConfirmPay = async () => {
        loading.value = true
        try {
            // 查询支付状态
            const res = await getPaymentStatus(props.orderNo)
            
            if (res && res.data === true) {
                // 支付成功
                currentStep.value = PayStep.SUCCESS
                emit('success', props.orderNo)
                ElMessage.success('支付成功')
            } else {
                // 支付未完成
                ElMessage.warning('支付未完成，请先扫码支付后再确认')
            }
        } finally {
            loading.value = false
        }
    }

    const getSelectedMethodInfo = () => {
        return paymentMethods.find(m => m.id === selectedMethod.value) || paymentMethods[0]
    }
</script>

<template>
    <el-dialog
        :model-value="visible"
        :title="currentStep === PayStep.SUCCESS ? '支付成功' : (currentStep === PayStep.QRCODE ? '扫码支付' : '选择支付方式')"
        width="400px"
        @close="handleClose"
        align-center
        class="payment-dialog"
        :close-on-click-modal="currentStep !== PayStep.QRCODE"
    >
        <!-- 第一步：选择支付方式 -->
        <div v-if="currentStep === PayStep.SELECT" class="py-4">
            <div class="text-center mb-8">
                <p class="text-gray-500 text-sm mb-1">支付总额</p>
                <div class="flex items-baseline justify-center gap-1">
                    <span class="text-orange-600 text-xl font-bold">¥</span>
                    <span class="text-orange-600 text-4xl font-black">{{ amount }}</span>
                </div>
                <p class="text-gray-400 text-xs mt-2">共 {{ quantity }} 件商品</p>
            </div>

            <div class="space-y-3">
                <div
                    v-for="method in paymentMethods"
                    :key="method.id"
                    class="payment-item flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-200"
                    :class="
                        selectedMethod === method.id
                            ? 'border-orange-500 bg-orange-50/30'
                            : 'border-gray-100 hover:border-orange-200'
                    "
                    @click="selectedMethod = method.id"
                >
                    <div class="flex items-center gap-3">
                        <div
                            class="w-10 h-10 rounded-full flex items-center justify-center"
                            :style="{ backgroundColor: method.bg }"
                        >
                            <el-icon :size="20" :style="{ color: method.color }">
                                <component :is="method.icon" />
                            </el-icon>
                        </div>
                        <span class="font-bold text-gray-700">{{ method.name }}</span>
                    </div>
                    <div
                        class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
                        :class="
                            selectedMethod === method.id
                                ? 'bg-orange-500 border-orange-500'
                                : 'border-gray-200'
                        "
                    >
                        <el-icon v-if="selectedMethod === method.id" color="white" :size="14"
                            ><Check
                        /></el-icon>
                    </div>
                </div>
            </div>
        </div>

        <!-- 第二步：扫码支付 -->
        <div v-else-if="currentStep === PayStep.QRCODE" class="py-4 flex flex-col items-center">
            <div class="text-center mb-6">
                <p class="text-gray-500 text-sm mb-1">请使用{{ getSelectedMethodInfo().name }}扫码支付</p>
                <div class="text-2xl font-black text-gray-800">¥{{ amount }}</div>
            </div>
            
            <div class="relative p-4 bg-white border-2 border-gray-50 rounded-2xl shadow-inner mb-6">
                <img :src="getSelectedMethodInfo().qrCode" alt="支付二维码" class="w-48 h-48" />
                <div v-if="loading" class="absolute inset-0 bg-white/80 flex items-center justify-center rounded-2xl">
                    <el-icon class="text-3xl text-orange-500 animate-spin"><Loading /></el-icon>
                </div>
            </div>

            <div class="mt-4 text-xs text-gray-400 flex items-center gap-1 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                <el-icon><CircleCheckFilled /></el-icon>
                <span>订单编号：</span>
                <span class="font-mono font-medium text-gray-600">{{ props.orderNo }}</span>
            </div>
        </div>

        <!-- 第三步：支付成功 -->
        <div v-else class="py-8 flex flex-col items-center justify-center text-center">
            <el-icon class="text-6xl text-green-500 mb-4">
                <CircleCheckFilled />
            </el-icon>
            <h3 class="text-xl font-bold text-gray-800 mb-2">支付成功</h3>
            <p class="text-gray-500 px-6">
                您的订单已支付成功，我们将尽快为您安排发货，感谢您的支持！
            </p>
        </div>

        <template #footer>
            <div class="flex gap-3 pt-2">
                <!-- 第一步按钮 -->
                <template v-if="currentStep === PayStep.SELECT">
                    <el-button class="flex-1 rounded-xl! h-12! font-bold" @click="handleClose">
                        取消
                    </el-button>
                    <el-button
                        type="primary"
                        class="flex-1! bg-orange-600! border-orange-600! hover:bg-orange-700! rounded-xl! h-12! font-bold shadow-lg shadow-orange-100"
                        :loading="loading"
                        @click="handleGoToPay"
                    >
                        确认支付
                    </el-button>
                </template>

                <!-- 第二步按钮 -->
                <template v-else-if="currentStep === PayStep.QRCODE">
                    <el-button class="flex-1 rounded-xl! h-12! font-bold" @click="currentStep = PayStep.SELECT" :disabled="loading">
                        返回修改
                    </el-button>
                    <el-button
                        type="primary"
                        class="flex-1! bg-orange-600! border-orange-600! hover:bg-orange-700! rounded-xl! h-12! font-bold shadow-lg shadow-orange-100"
                        :loading="loading"
                        @click="handleConfirmPay"
                    >
                        我已支付
                    </el-button>
                </template>

                <!-- 第三步按钮 -->
                <template v-else>
                    <el-button
                        type="primary"
                        class="flex-1! bg-orange-600! border-orange-600! hover:bg-orange-700! rounded-xl! h-12! font-bold shadow-lg shadow-orange-100"
                        @click="handleClose"
                    >
                        完成
                    </el-button>
                </template>
            </div>
        </template>
    </el-dialog>
</template>

<style scoped>
    :deep(.payment-dialog) {
        border-radius: 20px;
    }
    :deep(.payment-dialog .el-dialog__header) {
        margin-right: 0;
        padding-bottom: 20px;
        border-bottom: 1px solid #f8fafc;
    }
    :deep(.payment-dialog .el-dialog__title) {
        font-weight: 800;
        color: #1e293b;
    }
    :deep(.payment-dialog .el-dialog__body) {
        padding: 24px;
    }
    :deep(.payment-dialog .el-dialog__footer) {
        padding: 0 24px 24px;
    }

    .payment-item {
        position: relative;
        overflow: hidden;
    }
</style>