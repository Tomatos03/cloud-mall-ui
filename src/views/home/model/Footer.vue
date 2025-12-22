<template>
    <div class="w-full bg-white overflow-hidden">
        <div class="max-w-7xl mx-auto px-6 py-8">
            <div class="flex flex-col md:flex-row md:justify-between gap-6 min-w-0">
                <div class="flex-1">
                    <h4 class="text-lg font-semibold mb-2">OneLine 商城</h4>
                    <p class="text-sm text-gray-600 mb-3">为您提供优质商品与便捷购物体验</p>
                    <div class="text-sm text-gray-500">
                        客服热线：<a href="tel:400-800-0000" class="text-blue-500">400-800-0000</a
                        ><br />
                        营业时间：周一至周日 9:00 - 18:00
                    </div>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    <div>
                        <h5 class="font-medium mb-1">购物指南</h5>
                        <ul class="text-sm text-gray-600 space-y-1">
                            <li>
                                <router-link
                                    to="/help/shipping"
                                    class="text-gray-600 hover:text-blue-500"
                                    >配送说明</router-link
                                >
                            </li>
                            <li>
                                <router-link
                                    to="/help/return"
                                    class="text-gray-600 hover:text-blue-500"
                                    >售后政策</router-link
                                >
                            </li>
                            <li>
                                <router-link
                                    to="/help/faq"
                                    class="text-gray-600 hover:text-blue-500"
                                    >常见问题</router-link
                                >
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h5 class="font-medium mb-1">商家服务</h5>
                        <ul class="text-sm text-gray-600 space-y-1">
                            <li>
                                <router-link
                                    to="/seller/join"
                                    class="text-gray-600 hover:text-blue-500"
                                    >开店入驻</router-link
                                >
                            </li>
                            <li>
                                <router-link
                                    to="/seller/rules"
                                    class="text-gray-600 hover:text-blue-500"
                                    >商家规则</router-link
                                >
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h5 class="font-medium mb-1">关于我们</h5>
                        <ul class="text-sm text-gray-600 space-y-1">
                            <li>
                                <router-link to="/about" class="text-gray-600 hover:text-blue-500"
                                    >公司简介</router-link
                                >
                            </li>
                            <li>
                                <router-link to="/privacy" class="text-gray-600 hover:text-blue-500"
                                    >隐私政策</router-link
                                >
                            </li>
                            <li>
                                <router-link to="/terms" class="text-gray-600 hover:text-blue-500"
                                    >使用条款</router-link
                                >
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div
                class="mt-6 border-t border-gray-100 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500"
            >
                <div>© {{ year }} OneLine. 保留所有权利。</div>
                <div class="mt-2 sm:mt-0">备案信息: .......</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    const year = new Date().getFullYear()
</script>
