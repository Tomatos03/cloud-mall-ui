<script setup lang="ts">
    import { ref, watch } from 'vue'
    import { ElMessage } from 'element-plus'
    import { Check, Wallet, CreditCard, CircleCheckFilled } from '@element-plus/icons-vue'
    import http from '@/utils/http'

    const props = defineProps<{
        visible: boolean
        amount: number
        goodsId: string
        addressId?: number
        selectedOption?: string
    }>()

    const emit = defineEmits(['update:visible', 'success'])

    const paymentMethods = [
        {
            id: 'wechat',
            name: '微信支付',
            icon: Wallet,
            color: '#07C160',
            bg: '#F0F9F4',
        },
        {
            id: 'alipay',
            name: '支付宝支付',
            icon: CreditCard,
            color: '#1677FF',
            bg: '#F0F5FF',
        },
    ]

    const selectedMethod = ref('wechat')
    const loading = ref(false)
    const isSuccess = ref(false)

    // 监听显示状态，打开时重置成功状态
    watch(
        () => props.visible,
        (val) => {
            if (val) {
                isSuccess.value = false
            }
        },
    )

    const handleClose = () => {
        emit('update:visible', false)
    }

    const handlePay = async () => {
        loading.value = true
        try {
            // 模拟创建订单并支付的流程
            // 实际项目中通常是先创建订单，拿到订单号后再发起支付
            // 这里根据要求直接发送创建订单/支付请求
            await http.post('/order/create', {
                goodsId: props.goodsId,
                addressId: props.addressId,
                option: props.selectedOption,
                paymentMethod: selectedMethod.value,
                amount: props.amount,
            })

            isSuccess.value = true
        } catch (error) {
            console.error('支付失败:', error)
            ElMessage.error('支付失败，请稍后重试')
        } finally {
            loading.value = false
        }
    }
</script>

<template>
    <el-dialog
        :model-value="visible"
        :title="isSuccess ? '支付成功' : '选择支付方式'"
        width="400px"
        @close="handleClose"
        align-center
        class="payment-dialog"
    >
        <div v-if="!isSuccess" class="py-4">
            <!-- 金额展示 -->
            <div class="text-center mb-8">
                <p class="text-gray-500 text-sm mb-1">支付金额</p>
                <div class="flex items-baseline justify-center gap-1">
                    <span class="text-orange-600 text-xl font-bold">¥</span>
                    <span class="text-orange-600 text-4xl font-black">{{ amount }}</span>
                </div>
            </div>

            <!-- 支付方式列表 -->
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

        <!-- 支付成功展示 -->
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
                <template v-if="!isSuccess">
                    <el-button class="flex-1 rounded-xl! h-12! font-bold" @click="handleClose">
                        取消
                    </el-button>
                    <el-button
                        type="primary"
                        class="flex-1! bg-orange-600! border-orange-600! hover:bg-orange-700! rounded-xl! h-12! font-bold shadow-lg shadow-orange-100"
                        :loading="loading"
                        @click="handlePay"
                    >
                        确认支付
                    </el-button>
                </template>
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
