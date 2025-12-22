<!--
  地区选择器组件

  功能说明:
  - 使用懒加载方式加载中国行政区划数据（一级/二级/三级行政区）
  - 自动处理直辖市和特别行政区的特殊结构
  - 选中最后一级行政区后，返回完整的地区代码（regionCode）

  Props:
  - regionCode: 地区代码（可选），用于回显已选择的地区

  Events:
  - change: 地区选择变化时触发，返回地区代码字符串（最后一级的地区代码）

  使用示例:
  <AddressPicker
    :region-code="formData.regionCode"
    @change="(code) => formData.regionCode = code"
  />

  地区结构说明:
  1. 标准省份（如河北省）: 省(130000) -> 市(130100) -> 区(130102)
  2. 直辖市（如北京市）: 省(110000) -> 区(110101)，无二级行政区
  3. 特别行政区（如香港）: 省(810000)，可能无下级或只有部分下级
  
  注意事项:
  - 地区代码规则：
    * 一级行政区：后4位为0000，如 "110000" (北京市)
    * 二级行政区：后2位为00但不全为0，如 "130100" (石家庄市)
    * 三级行政区：其他情况，如 "110101" (东城区)
  - 直辖市特殊处理：北京(110000)下直接是区(110101)，跳过不存在的110100
  - 使用 getDirectChildRegions 方法自动识别并返回正确的子级地区
-->
<template>
    <el-cascader
        v-model="selectedCodes"
        :options="options"
        :props="cascaderProps"
        clearable
        placeholder="请选择地区"
        class="w-80"
        @change="handleChange"
    />
</template>

<script setup lang="ts">
    import { ref, watch, onMounted } from 'vue'
    import type { CascaderNode, CascaderNodeValue } from 'element-plus'
    import {
        buildRegionTree,
        getDirectChildrenRegions,
        getRegionsByLevel,
        hasDirectRegions,
    } from '@/utils/china-region-data'

    // 接收父组件的 props
    const props = defineProps<{
        regionCode?: string
    }>()

    interface RegionOption {
        code: string
        name: string
        leaf: boolean
        children?: RegionOption[]
    }

    // 级联选择器配置
    const cascaderProps = {
        value: 'code',
        label: 'name',
        children: 'children',
        lazy: true,
        lazyLoad: (node: CascaderNode, resolve: (data: RegionOption[]) => void) => {
            let nodes: RegionOption[] = []
            if (node.level === 0) {
                nodes = getRegionsByLevel(node.level + 1).map((region) => ({
                    code: region.code,
                    name: region.name,
                    leaf: !hasDirectRegions(region.code),
                }))
                console.log(nodes)
            } else {
                console.log(node)
                nodes = getDirectChildrenRegions(node.value + '').map((region) => ({
                    code: region.code,
                    name: region.name,
                    leaf: !hasDirectRegions(region.code),
                }))
            }
            resolve(nodes)
        },
    }

    // 选中的代码数组：['省代码', '市代码', '区代码']
    const selectedCodes = ref<string[]>([])

    // 初始选项（用于非懒加载模式，这里保留以防需要）
    const options = ref<RegionOption[]>([])

    // 向父组件发出事件
    const emit = defineEmits<{
        (e: 'change', regionCode: string): void
    }>()

    // 处理选择变化
    const handleChange = (codes: string[]) => {
        if (!codes || codes.length === 0) {
            emit('change', '')
            return
        }

        // 获取最后一级的代码（实际选中的最细粒度地区）
        const finalCode = codes[codes.length - 1]
        emit('change', finalCode || '')
    }

    // 根据地区代码初始化选中值
    const initByRegionCode = (code?: string) => {
        if (!code) {
            selectedCodes.value = []
            return
        }

        const tree = buildRegionTree(code)
        selectedCodes.value = tree.map((node) => node.code)
    }

    // 初始化选中值
    const initSelected = () => {
        // 优先使用 regionCode
        if (props.regionCode) {
            initByRegionCode(props.regionCode)
            return
        }

        // 如果没有 regionCode，尝试通过名称查找（这种方式不太准确，建议使用 regionCode）
        // 这里暂时清空，因为没有可靠的方式通过名称反查代码
        selectedCodes.value = []
    }

    // 组件挂载时初始化
    onMounted(() => {
        initSelected()
    })

    // 监听 props 的变化
    watch(
        () => props.regionCode,
        (newCode) => {
            initByRegionCode(newCode)
        },
    )

    // 暴露给父组件
    defineExpose({
        selectedCodes,
    })
</script>
