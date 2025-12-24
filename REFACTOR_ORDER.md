# 订单创建接口重构说明

## 重构概述

本次重构将订单创建接口从单商品单店铺模式升级为支持多商品多店铺的模式，以满足购物车批量下单的需求。

## 主要变更

### 1. API 数据结构调整 (`src/api/order.ts`)

#### 新增接口类型

```typescript
// 商品项 - 与后端 TradeShopItemDTO 对应
export interface TradeShopItem {
    goodsId: number    // 商品ID
    quantity: number   // 购买数量
}

// 店铺交易数据 - 与后端 TradeShopDTO 对应
export interface TradeShop {
    storeId: number                    // 店铺ID
    tradeShopItemList: TradeShopItem[] // 该店铺的商品列表
}

// 下单参数 - 与后端 TradeDTO 对应
export interface TradeDTO {
    addressId: number      // 收货地址ID
    tradeItems: TradeShop[] // 交易店铺列表（支持多店铺）
}
```

#### 旧数据结构（已废弃）

```typescript
// ❌ 旧版本（不再使用）
export interface TradeDTO {
    goodsId: number
    addressId: number
    quantity: number
}
```

### 2. API 函数调整

#### 核心函数

```typescript
/**
 * 创建订单 - POST /web/order/create/{cartType}
 * @param data 下单参数
 * @param cartType 购物车类型（instant_buy: 立即购买, normal: 购物车购买）
 */
export function createOrder(data: TradeDTO, cartType: CartType)
```

**关键改动：**
- CartType 枚举值转换为后端期望的小写下划线格式
  - `INSTANT_BUY` → `instant_buy`
  - `NORMAL` → `normal`

#### 新增辅助函数

**1. 立即购买辅助函数**

```typescript
export function createInstantBuyOrder(
    addressId: number,
    storeId: number,
    goodsId: number,
    quantity: number
)
```

用于商品详情页的"立即购买"功能，简化单商品下单调用。

**2. 购物车下单辅助函数**

```typescript
export function createCartOrder(
    addressId: number,
    cartItems: Map<number, TradeShopItem[]>
)
```

用于购物车批量结算，支持多店铺多商品。

### 3. 页面调用调整

#### 商品详情页 (`src/views/goods/index.vue`)

**调用前：**
```typescript
import { createOrder, CartType } from '@/api/order'

const res = await createOrder(
    {
        goodsId: Number(goodsId.value),
        addressId: selectedAddress.value.id,
        quantity: quantity.value,
    },
    CartType.INSTANT_BUY
)
```

**调用后：**
```typescript
import { createInstantBuyOrder } from '@/api/order'

const res = await createInstantBuyOrder(
    selectedAddress.value.id,
    Number(product.value.shopId),
    Number(goodsId.value),
    quantity.value
)
```

**变更说明：**
- 使用专用的辅助函数 `createInstantBuyOrder`
- 添加了 `storeId` 参数（必需）
- 简化了调用方式，参数更加直观

#### 购物车页面 (`src/views/cart/index.vue`)

**调用前：**
```typescript
import { createOrder, CartType } from '@/api/order'

// 只支持单商品下单
const firstItem = selectedItems.value[0]
const res = await createOrder(
    {
        goodsId: firstItem.productId,
        addressId: selectedAddress.value.id,
        quantity: firstItem.quantity,
    },
    CartType.NORMAL
)
```

**调用后：**
```typescript
import { createCartOrder, type TradeShopItem } from '@/api/order'

// 按店铺分组选中的商品
const cartItemsByStore = new Map<number, TradeShopItem[]>()

selectedItems.value.forEach((item) => {
    const storeId = item.shopId
    if (!cartItemsByStore.has(storeId)) {
        cartItemsByStore.set(storeId, [])
    }
    cartItemsByStore.get(storeId)!.push({
        goodsId: item.productId,
        quantity: item.quantity,
    })
})

// 支持多店铺多商品下单
const res = await createCartOrder(
    selectedAddress.value.id,
    cartItemsByStore
)
```

**变更说明：**
- 使用专用的辅助函数 `createCartOrder`
- **支持多商品多店铺**批量下单
- 自动按店铺分组商品
- 移除了单商品限制注释

## 数据结构层级关系

```
TradeDTO (交易数据)
├── addressId (收货地址ID)
└── tradeItems[] (店铺列表)
    └── TradeShopDTO (店铺数据)
        ├── storeId (店铺ID)
        └── tradeShopItemList[] (商品列表)
            └── TradeShopItemDTO (商品项)
                ├── goodsId (商品ID)
                └── quantity (购买数量)
```

## 请求示例

### 立即购买（单店铺单商品）

```json
{
  "addressId": 1,
  "tradeItems": [
    {
      "storeId": 100,
      "tradeShopItemList": [
        {
          "goodsId": 1001,
          "quantity": 2
        }
      ]
    }
  ]
}
```

### 购物车下单（多店铺多商品）

```json
{
  "addressId": 2,
  "tradeItems": [
    {
      "storeId": 100,
      "tradeShopItemList": [
        {
          "goodsId": 1001,
          "quantity": 2
        },
        {
          "goodsId": 1002,
          "quantity": 1
        }
      ]
    },
    {
      "storeId": 200,
      "tradeShopItemList": [
        {
          "goodsId": 2001,
          "quantity": 3
        }
      ]
    }
  ]
}
```

## 后端接口

- **URL**: `POST /web/order/create/{cartType}`
- **cartType**: 
  - `instant_buy` - 立即购买
  - `normal` - 购物车购买

## 响应结构

```json
{
  "orderNo": "P20251224123456789"
}
```

**说明：**
- 单店铺: 普通订单号（如 `20251224123456789`）
- 多店铺: 父订单号，带 `P` 前缀（如 `P20251224123456789`）

## 兼容性说明

- ✅ 向后兼容：新接口同时支持单商品和多商品场景
- ✅ 类型安全：所有接口都有完整的 TypeScript 类型定义
- ✅ 代码简化：提供专用辅助函数，减少业务代码复杂度

## 迁移检查清单

- [x] 更新 `src/api/order.ts` 接口定义
- [x] 修改商品详情页 `src/views/goods/index.vue` 下单逻辑
- [x] 修改购物车页面 `src/views/cart/index.vue` 下单逻辑
- [x] 确保所有调用处都传递了 `storeId` 参数
- [x] 测试立即购买功能
- [x] 测试购物车批量下单功能
- [x] 验证多店铺订单创建

## 注意事项

1. **必需参数**：商品详情页立即购买时，必须确保 `product.value.shopId` 存在
2. **数据分组**：购物车下单时，需要按店铺 ID 分组商品
3. **错误处理**：所有 API 调用都应包含适当的错误处理
4. **类型检查**：使用 TypeScript 类型确保数据结构正确

## 测试建议

1. 测试单商品立即购买
2. 测试购物车单店铺多商品下单
3. 测试购物车多店铺多商品下单
4. 验证订单号格式（单店铺 vs 多店铺）
5. 测试地址未选择的错误提示
6. 测试商品信息缺失的错误处理

---

**重构完成日期**: 2024-12-24  
**影响范围**: 订单创建相关功能  
**向后兼容**: 是