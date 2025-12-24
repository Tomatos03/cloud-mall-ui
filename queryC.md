## Assistant

# 📖 用户订单分页查询接口文档

## 📌 接口概览

**接口地址**: `GET /web/order/page`

**接口描述**: 用户端订单列表分页查询，支持多维度筛选，返回聚合订单视图（包含店铺订单和商品明细）

**权限要求**: 🔒 需要用户登录（通过 Token 自动识别当前用户）

**适用场景**: 
- 订单列表页
- "我的订单"页面
- 订单状态筛选（全部/待付款/待发货/待收货/已完成等）

---

## 📥 请求参数

### Query 参数（拼接在 URL 后）

| 参数名 | 类型 | 必填 | 默认值 | 说明 | 示例值 |
|--------|------|:----:|--------|------|--------|
| `pageNum` | Integer | 否 | `1` | 页码（从1开始） | `1` |
| `pageSize` | Integer | 否 | `10` | 每页显示条数 | `10` |
| `orderNo` | String | 否 | - | 订单号（支持模糊搜索） | `P20250123` |
| `status` | String | 否 | - | 订单状态（精确匹配） | `SHIPPED` |
| `orderType` | String | 否 | - | 订单类型 | `PARENT` |
| `storeId` | Long | 否 | - | 店铺ID（筛选某个店铺的订单） | `101` |
| `startTime` | String | 否 | - | 开始时间（ISO 8601格式） | `2025-01-01T00:00:00` |
| `endTime` | String | 否 | - | 结束时间（ISO 8601格式） | `2025-01-31T23:59:59` |

### 📋 订单状态枚举 (status)

| 状态码 | 中文描述 | 使用场景 |
|--------|----------|----------|
| `UNPAID` | 待付款 | 筛选未支付的订单 |
| `PAID` | 已支付/待发货 | 筛选已付款待发货的订单 |
| `PENDING_SHIP` | 待发货 | 筛选等待商家发货的订单 |
| `SHIPPED` | 已发货/待收货 | 筛选待收货的订单 |
| `COMPLETED` | 已完成 | 筛选已完成的订单 |
| `CANCELLED` | 已取消 | 筛选已取消的订单 |
| `REFUNDED` | 已退款 | 筛选已退款的订单 |

---

## 📤 响应数据

### 响应结构

```json
{
  "current": 1,          // 当前页码
  "size": 10,            // 每页条数
  "total": 48,           // 总记录数
  "pages": 5,            // 总页数
  "records": [           // 订单数据列表
    {
      "orderId": 1001,
      "orderNo": "P202501231234567890",
      "orderType": "PARENT",
      "totalPrice": 2339600,
      "status": "SHIPPED",
      "statusDesc": "待收货",
      "createTime": "2025-01-23T15:30:26",
      "shopOrders": [
        {
          "orderId": 10011,
          "orderNo": "S202501231234567890-1",
          "orderType": "SUB",
          "storeId": 101,
          "storeName": "Apple 官方旗舰店",
          "totalPrice": 989800,
          "status": "SHIPPED",
          "statusDesc": "已发货",
          "num": 2,
          "items": [
            {
              "id": 100111,
              "orderId": 10011,
              "goodsId": 5001,
              "goodsName": "iPhone 15 Pro 256GB 深空黑",
              "goodsImg": "https://cdn.example.com/goods/iphone15pro.jpg",
              "price": 799900,
              "num": 1
            }
          ],
          "rate": null,
          "comment": null,
          "reply": null
        }
      ]
    }
  ]
}
```

### 📊 字段说明

#### 1️⃣ 分页信息

| 字段 | 类型 | 说明 |
|------|------|------|
| `current` | Integer | 当前页码 |
| `size` | Integer | 每页条数 |
| `total` | Long | 总记录数 |
| `pages` | Integer | 总页数 |
| `records` | Array | 订单数据数组 |

#### 2️⃣ OrderAggregateVO（订单聚合视图）

| 字段 | 类型 | 必返回 | 说明 | 示例 |
|------|------|:------:|------|------|
| `orderId` | Long | ✅ | 订单ID | `1001` |
| `orderNo` | String | ✅ | 订单号 | `P202501231234567890` |
| `orderType` | String | ✅ | 订单类型（PARENT/NORMAL） | `PARENT` |
| `totalPrice` | Long | ✅ | 订单总价（**单位：分**） | `2339600` |
| `status` | String | ✅ | 订单状态码 | `SHIPPED` |
| `statusDesc` | String | ✅ | 状态描述（中文） | `待收货` |
| `createTime` | String | ✅ | 创建时间（ISO 8601格式） | `2025-01-23T15:30:26` |
| `shopOrders` | Array | ✅ | 店铺订单列表 | `[ShopOrderVO, ...]` |

> **💡 提示**: `totalPrice` 单位为**分**，需要除以 100 转为元。例如：`2339600` → `23396.00 元`

#### 3️⃣ ShopOrderVO（店铺订单视图）

| 字段 | 类型 | 必返回 | 说明 | 示例 |
|------|------|:------:|------|------|
| `orderId` | Long | ✅ | 子订单ID（或普通订单ID） | `10011` |
| `orderNo` | String | ✅ | 子订单号 | `S202501231234567890-1` |
| `orderType` | String | ✅ | 订单类型（SUB/NORMAL） | `SUB` |
| `storeId` | Long | ✅ | 店铺ID | `101` |
| `storeName` | String | ✅ | 店铺名称 | `Apple 官方旗舰店` |
| `totalPrice` | Long | ✅ | 该店铺小计（**单位：分**） | `989800` |
| `status` | String | ✅ | 订单状态码 | `SHIPPED` |
| `statusDesc` | String | ✅ | 状态描述 | `已发货` |
| `num` | Long | ✅ | 商品项总数 | `2` |
| `items` | Array | ✅ | 商品明细列表 | `[OrderItem, ...]` |
| `rate` | Integer | ❌ | 评分（1-5，未评价为null） | `5` |
| `comment` | String | ❌ | 评价内容（未评价为null） | `质量很好` |
| `reply` | String | ❌ | 商家回复（未回复为null） | `感谢支持` |

#### 4️⃣ OrderItem（商品明细）

| 字段 | 类型 | 必返回 | 说明 | 示例 |
|------|------|:------:|------|------|
| `id` | Long | ✅ | 订单项ID | `100111` |
| `orderId` | Long | ✅ | 所属订单ID | `10011` |
| `goodsId` | Long | ✅ | 商品ID | `5001` |
| `goodsName` | String | ✅ | 商品名称 | `iPhone 15 Pro 256GB` |
| `goodsImg` | String | ✅ | 商品图片URL | `https://cdn.example.com/...` |
| `price` | Long | ✅ | 商品单价（**单位：分**） | `799900` |
| `num` | Integer | ✅ | 购买数量 | `1` |

---

## 🚀 使用示例

### 示例 1：查询全部订单（默认第1页）

**请求**:
```http
GET /web/order/page?pageNum=1&pageSize=10
```

**等价于**:
```javascript
fetch('/web/order/page?pageNum=1&pageSize=10')
```

**说明**: 不传 `status` 参数时，返回用户的**所有状态**订单

---

### 示例 2：查询待收货订单

**请求**:
```http
GET /web/order/page?pageNum=1&pageSize=10&status=SHIPPED
```

**Axios 示例**:
```javascript
axios.get('/web/order/page', {
  params: {
    pageNum: 1,
    pageSize: 10,
    status: 'SHIPPED'  // 只查待收货订单
  }
}).then(res => {
  console.log('订单列表:', res.data.records);
  console.log('总数:', res.data.total);
});
```

---

### 示例 3：搜索订单号

**请求**:
```http
GET /web/order/page?pageNum=1&pageSize=10&orderNo=P20250123
```

**说明**: `orderNo` 支持模糊查询，输入部分订单号即可匹配

---

### 示例 4：按时间范围查询

**请求**:
```http
GET /web/order/page?pageNum=1&pageSize=10&startTime=2025-01-01T00:00:00&endTime=2025-01-31T23:59:59
```

**Fetch 示例**:
```javascript
const params = new URLSearchParams({
  pageNum: 1,
  pageSize: 10,
  startTime: '2025-01-01T00:00:00',
  endTime: '2025-01-31T23:59:59'
});

fetch(`/web/order/page?${params}`)
  .then(res => res.json())
  .then(data => {
    console.log('订单列表:', data.records);
  });
```

## ⚠️ 注意事项

### 1. 金额单位
- ⚠️ **所有金额字段单位均为「分」**，前端需要除以 100 转为元
- 示例：`totalPrice: 2339600` → 显示为 `￥23,396.00`

### 2. 时间格式
- ⏰ 后端返回 **ISO 8601** 格式：`2025-01-23T15:30:26`
- 前端可使用 `new Date()` 直接解析

### 3. 空值处理
- 评价相关字段（`rate`、`comment`、`reply`）未评价时为 `null`
- 需要进行空值判断：`if (shopOrder.rate !== null) { ... }`

### 4. 父订单与普通订单的区别
- **父订单**（`orderType: "PARENT"`）：`shopOrders` 包含多个子订单
- **普通订单**（`orderType: "NORMAL"`）：`shopOrders` 只有1个元素（订单自身）

### 5. 状态显示优化
- 父订单需计算是否"部分已发货"，建议使用 `calculateShipStatus` 函数
- 子订单直接使用 `statusDesc` 字段

---

## 🔍 常见问题

### Q1: 如何实现"全部订单"标签？
**A**: 不传 `status` 参数即可查询全部订单：
```javascript
axios.get('/web/order/page', {
  params: { pageNum: 1, pageSize: 10 }
  // 不传 status
});
```

### Q2: 搜索订单号时是否区分大小写？
**A**: 不区分大小写，支持模糊匹配。输入 `p2025` 可以匹配 `P202501231234567890`

### Q3: 时间范围查询的格式是什么？
**A**: ISO 8601 格式：`2025-01-23T15:30:26`，也可以只传日期：`2025-01-23`

### Q4: 如何判断订单是否已评价？
**A**: 检查 `shopOrder.rate` 是否为 `null`：
```javascript
const isEvaluated = shopOrder.rate !== null;
```

### Q5: 父订单的 `totalPrice` 是所有子订单的总和吗？
**A**: 是的。父订单的 `totalPrice` = 所有子订单的 `totalPrice` 之和

---

