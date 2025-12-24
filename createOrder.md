## 创建订单接口

### 接口信息
- **URL**: `POST /web/order/create/{cartType}`
- **cartType**: 路径参数
  - `instant_buy` - 立即购买（直接下单）
  - `normal` - 购物车购买

### 请求结构

#### 1. **立即购买（单店铺单商品）**

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

**说明**:
- `addressId`: 收货地址ID（必填）
- `tradeItems`: 交易店铺列表（必填，数组）
  - `storeId`: 店铺ID（必填）
  - `tradeShopItemList`: 该店铺的商品列表（必填，数组）
    - `goodsId`: 商品ID（必填）
    - `quantity`: 购买数量（必填，大于0）

---

#### 2. **购物车下单（多店铺多商品）**

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
        },
        {
          "goodsId": 2002,
          "quantity": 1
        }
      ]
    }
  ]
}
```

**说明**:
- 多个店铺时，`tradeItems` 数组包含多个店铺对象
- 每个店铺可以包含多个商品

---

### 完整的 cURL 示例

#### 立即购买示例
```bash
curl -X POST 'http://localhost:8080/web/order/create/instant_buy' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -d '{
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
  }'
```

#### 购物车下单示例
```bash
curl -X POST 'http://localhost:8080/web/order/create/normal' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -d '{
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
  }'
```

---

### 响应结构

```json
{
  "orderNo": "P20251224123456789"
}
```

**说明**:
- `orderNo`: 订单号
  - 单店铺: 普通订单号（如 `20251224123456789`）
  - 多店铺: 父订单号，带 `P` 前缀（如 `P20251224123456789`）

---

### 前端 JavaScript/TypeScript 示例

```typescript
// 定义类型
interface TradeShopItem {
  goodsId: number;
  quantity: number;
}

interface TradeShop {
  storeId: number;
  tradeShopItemList: TradeShopItem[];
}

interface TradeDTO {
  addressId: number;
  tradeItems: TradeShop[];
}

// 立即购买
async function createInstantBuyOrder(addressId: number, storeId: number, goodsId: number, quantity: number) {
  const data: TradeDTO = {
    addressId: addressId,
    tradeItems: [
      {
        storeId: storeId,
        tradeShopItemList: [
          {
            goodsId: goodsId,
            quantity: quantity
          }
        ]
      }
    ]
  };

  const response = await fetch('/web/order/create/instant_buy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  return await response.json();
}

// 购物车下单
async function createCartOrder(addressId: number, cartItems: Map<number, TradeShopItem[]>) {
  const tradeItems: TradeShop[] = Array.from(cartItems.entries()).map(([storeId, items]) => ({
    storeId: storeId,
    tradeShopItemList: items
  }));

  const data: TradeDTO = {
    addressId: addressId,
    tradeItems: tradeItems
  };

  const response = await fetch('/web/order/create/normal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  return await response.json();
}
```

---

### 数据结构层级关系

```
TradeDTO (交易数据)
└── addressId (收货地址ID)
└── tradeItems[] (店铺列表)
    └── TradeShopDTO (店铺数据)
        └── storeId (店铺ID)
        └── tradeShopItemList[] (商品列表)
            └── TradeShopItemDTO (商品项)
                └── goodsId (商品ID)
                └── quantity (购买数量)
```

这就是前端发送订单创建请求的完整结构！
