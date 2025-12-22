<template>
    <div class="min-h-screen bg-gray-50">
        <!-- 顶部导航栏 -->
        <Header />

        <!-- 商品详情主体 -->
        <div class="max-w-7xl mx-auto p-6">
            <div v-if="loading" class="text-center py-20">
                <el-icon class="is-loading text-4xl">
                    <Loading />
                </el-icon>
                <p class="mt-4 text-gray-500">加载中...</p>
            </div>

            <div v-else-if="product" class="bg-white rounded-lg shadow-md p-6">
                <!-- 顶部商店信息 -->
                <div class="flex items-center justify-between mb-6 pb-4 border-b">
                    <div class="flex items-center space-x-3">
                        <img
                            class="w-16 h-16 rounded-full"
                            :src="product.mainImage"
                            alt="店铺头像"
                        />
                        <div>
                            <h2 class="text-lg font-bold text-gray-800">富士商店</h2>
                            <p class="text-sm text-gray-500">商铺产品</p>
                        </div>
                    </div>
                    <el-button type="primary" plain>进入店铺</el-button>
                </div>

                <!-- 商品信息区域 -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <!-- 左侧：图片展示区 -->
                    <div class="space-y-4">
                        <!-- 主图 -->
                        <div
                            class="border border-gray-200 rounded-lg overflow-hidden aspect-square flex items-center justify-center bg-white"
                        >
                            <img
                                :src="currentImage"
                                alt="商品主图"
                                class="max-w-full max-h-full object-contain"
                            />
                        </div>

                        <!-- 缩略图列表 -->
                        <div class="flex gap-2">
                            <div
                                v-for="(img, index) in product.images"
                                :key="index"
                                class="w-20 h-20 border-2 rounded-lg overflow-hidden cursor-pointer hover:border-primary transition"
                                :class="{
                                    'border-primary': currentImage === img,
                                    'border-gray-200': currentImage !== img,
                                }"
                                @click="currentImage = img"
                            >
                                <img :src="img" alt="缩略图" class="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>

                    <!-- 右侧：商品信息 -->
                    <div class="space-y-6">
                        <!-- 商品标题 -->
                        <h1 class="text-2xl font-bold text-gray-900">
                            {{ product.title }}
                        </h1>

                        <!-- 描述 -->
                        <p class="text-gray-600 leading-relaxed">
                            {{ product.desc }}
                        </p>

                        <!-- 价格 -->
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <div class="flex items-baseline">
                                <span class="text-red-500 text-3xl font-bold"
                                    >¥{{ product.price }}</span
                                >
                                <span class="text-gray-500 ml-2">/只</span>
                            </div>
                        </div>

                        <!-- 商品信息 -->
                        <div class="space-y-3 text-sm">
                            <div class="flex">
                                <span class="text-gray-500 w-20">已售：</span>
                                <span class="text-gray-900 font-medium">{{ product.sales }}</span>
                            </div>
                            <div class="flex">
                                <span class="text-gray-500 w-20">库存：</span>
                                <span class="text-gray-900 font-medium">{{ product.stock }}</span>
                            </div>
                            <div class="flex">
                                <span class="text-gray-500 w-20">上架日期：</span>
                                <span class="text-gray-900 font-medium">{{
                                    product.createTime
                                }}</span>
                            </div>
                            <div class="flex">
                                <span class="text-gray-500 w-20">配送：</span>
                                <el-select
                                    v-model="selectedShipFrom"
                                    placeholder="请选择配送地址"
                                    class="flex-1"
                                >
                                    <el-option label="山东/济南 等" value="山东/济南" />
                                    <el-option label="北京" value="北京" />
                                    <el-option label="上海" value="上海" />
                                </el-select>
                            </div>
                            <div class="flex">
                                <span class="text-gray-500 w-20">味道：</span>
                                <el-select
                                    v-model="selectedOption"
                                    placeholder="请选择"
                                    class="flex-1"
                                >
                                    <el-option
                                        v-for="option in product.options"
                                        :key="option"
                                        :label="option"
                                        :value="option"
                                    />
                                </el-select>
                            </div>
                        </div>

                        <!-- 操作按钮 -->
                        <div class="flex gap-3 pt-4">
                            <el-button
                                type="danger"
                                size="large"
                                class="flex-1"
                                @click="handleBuyNow"
                            >
                                直接下单
                            </el-button>
                            <el-button
                                type="warning"
                                size="large"
                                class="flex-1"
                                @click="handleAddToCart"
                            >
                                加入购物车
                            </el-button>
                            <el-button size="large" :icon="Star" @click="handleFavorite">
                                收藏
                            </el-button>
                        </div>
                    </div>
                </div>

                <!-- 详情标签页 -->
                <el-tabs v-model="activeTab" class="mt-6">
                    <el-tab-pane label="商品详情" name="detail">
                        <div class="py-6 px-4">
                            <div class="prose max-w-none">
                                <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {{ product.detail || product.desc }}
                                </p>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="历史评价" name="comments">
                        <div class="py-6 px-4">
                            <div v-if="product.comments && product.comments.length > 0">
                                <div
                                    v-for="comment in product.comments"
                                    :key="comment.id"
                                    class="border-b pb-4 mb-4 last:border-b-0"
                                >
                                    <div class="flex items-center justify-between mb-2">
                                        <span class="font-medium text-gray-900">{{
                                            comment.user
                                        }}</span>
                                        <el-rate v-model="comment.rating" disabled size="small" />
                                    </div>
                                    <p class="text-gray-600 mb-2">{{ comment.content }}</p>
                                    <span class="text-xs text-gray-400">{{ comment.time }}</span>
                                </div>
                            </div>
                            <div v-else class="text-center py-10 text-gray-400">暂无评价</div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>

            <div v-else class="text-center py-20">
                <p class="text-gray-500">商品不存在</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { ElMessage } from 'element-plus'
    import { Loading, Star } from '@element-plus/icons-vue'
    import Header from '@/views/home/model/Header.vue'
    import type { ProductDetail } from '@/api/goods'
    import { useRoute } from 'vue-router'

    const loading = ref(true)
    const product = ref<ProductDetail | null>(null)
    const currentImage = ref('')
    const activeTab = ref('detail')
    const selectedShipFrom = ref('山东/济南')
    const selectedOption = ref('')
    const route = useRoute()
    const goodsId = ref<number | null>(null)

    // 静态数据
    const mockProductData: ProductDetail = {
        id: 6,
        title: 'HUAWEI WATCH 4 Pro 木星棕 深邃商务皮表带',
        desc: '一键微信、黄金檀香长续航、科技陶瓷表身 ¥ 2799',
        price: 2999,
        stock: 1,
        sales: 11,
        mainImage:
            'https://res.vmallres.com/pimages//uomcdn/CN/pms/202410/gbom/6942103126253/428_428_1728290612827mp.png',
        images: [
            'https://res.vmallres.com/pimages//uomcdn/CN/pms/202410/gbom/6942103126253/428_428_1728290612827mp.png',
            'https://res.vmallres.com/pimages//uomcdn/CN/pms/202410/gbom/6942103126253/428_428_1728290613071mp.png',
            'https://res.vmallres.com/pimages//uomcdn/CN/pms/202410/gbom/6942103126253/428_428_1728290613313mp.png',
        ],
        createTime: '2024-10-11',
        shipFrom: '山东/济南 等',
        options: ['木星棕皮表带', '深空黑皮表带', '星际蓝皮表带'],
        detail: `华为WATCH 4 Pro e5M经典款表全新升级,结合尊贵外观和强大健康管理能力。这款智能手表精选高档材质打造，顶尖工艺，具备优雅外形，还拥有强大的一站式健康管理工具。

华为WATCH 4 Pro e5M经典款采用精致科技陶瓷表身，细腻顺滑、抗刮、抗压抗腐蚀，经久如新。同时搭配柔软细腻真皮表带，舒适贴合手腕，柔韧耐磨。表盘灵活可定制，助你轻松打造专属表盘。

该产品在功能上秉承科技赋能生活的理念，配备精准健康传感器，可测量心率、血氧、体温和微循环阻力指数，汇集健康数据全析。可进行ECG分析，筛查房颤风险，帮你快速了解心律异常。同时具备科学运动功能，支持超百种运动模式，自动识别运动数据，精准记录。

此外，华为WATCH 4 Pro e5M经典款具备智能交互体验，可轻松微信聊天、快捷支付和遥控拍照，还支持离线定位、自定义键和 NFC 刷卡等便捷功能，满足智慧生活多种使用场景。

特色卖点：
• 尊贵外观：科技陶瓷表身，真皮表带
• 一站式健康管理：心率、血氧、体温、ECG 分析
• 科学运动：100+ 运动模式，自动记录
• 长续航：多种省电模式，超长待机
• 智能交互：微信收发、支付、NFC`,
        comments: [
            {
                id: 1,
                user: '张三',
                content: '手表质感非常好，做工精致，戴着很舒适，功能也很强大，非常满意！',
                rating: 5,
                time: '2024-11-15 14:30',
            },
            {
                id: 2,
                user: '李四',
                content: '外观漂亮，健康监测功能很实用，电池续航也不错，值得购买。',
                rating: 5,
                time: '2024-11-10 09:20',
            },
            {
                id: 3,
                user: '王五',
                content: '用了一周，各方面都很满意，就是价格有点贵，但物有所值。',
                rating: 4,
                time: '2024-11-05 16:45',
            },
        ],
    }

    // 加载商品详情（使用静态数据）
    const loadProductDetail = async () => {
        try {
            loading.value = true

            // 获取路由参数中的商品 ID
            const id = route.params.id
            if (id) {
                goodsId.value = Number(id)
                console.log('加载商品 ID:', goodsId.value)
            }

            // 模拟网络延迟
            await new Promise((resolve) => setTimeout(resolve, 500))

            product.value = mockProductData
            currentImage.value = mockProductData.mainImage || mockProductData.images[0] || ''
            if (mockProductData.options && mockProductData.options.length > 0) {
                selectedOption.value = mockProductData.options[0] || ''
            }
        } catch (error) {
            console.error('加载商品详情失败:', error)
            ElMessage.error('加载商品详情失败')
        } finally {
            loading.value = false
        }
    }

    // 直接下单
    const handleBuyNow = () => {
        ElMessage.success('正在跳转到订单页面...')
        // TODO: 实现跳转到订单确认页
    }

    // 加入购物车
    const handleAddToCart = () => {
        ElMessage.success('已加入购物车')
        // TODO: 实现加入购物车逻辑
    }

    // 收藏
    const handleFavorite = () => {
        ElMessage.success('已收藏')
        // TODO: 实现收藏逻辑
    }

    onMounted(() => {
        loadProductDetail()
    })
</script>

<style scoped>
    :deep(.el-tabs__item) {
        font-size: 16px;
        font-weight: 500;
    }

    :deep(.el-tabs__active-bar) {
        background-color: #409eff;
    }

    .is-loading {
        animation: rotating 2s linear infinite;
    }

    @keyframes rotating {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    .border-primary {
        border-color: #409eff;
    }

    .hover\:border-primary:hover {
        border-color: #409eff;
    }
</style>
