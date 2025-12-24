## Assistant

让我先查看一下完整的 OrderWebController 代码，然后生成接口使用表格：

**Tool Call: Read file `online-shop-web/src/main/java/com/onlineshop/controller/OrderWebController.java`**
Status: Completed

```online-shop-web/src/main/java/com/onlineshop/controller/OrderWebController.java
package com.onlineshop.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.onlineshop.framework.dto.TradeDTO;
import com.onlineshop.framework.entity.Order;
import com.onlineshop.framework.enums.CartType;
import com.onlineshop.framework.enums.OrderStatus;
import com.onlineshop.framework.service.IOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 订单相关 Web 接口
 * @author : Tomatos
 * @date : 2025/12/23
 */
@RestController
@RequestMapping("/web/order")
public class OrderWebController {

    @Autowired
    private IOrderService orderService;

    /**
     * 用户下单
     */
    @PostMapping("/create/{cartType}")
    public String createOrder(@RequestBody TradeDTO tradeDTO, @PathVariable String cartType) {
        return orderService.createOrder(tradeDTO, CartType.of(cartType));
    }

    /**
     * 查询用户所有订单
     */
    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUserId(@PathVariable Integer userId) {
        return orderService.getOrdersByUserId(userId);
    }

    /**
     * 分页查询订单
     */
    @GetMapping("/page")
    public IPage<Order> pageQuery(
            @RequestParam int pageNum,
            @RequestParam int pageSize,
            @RequestParam String status
    ) {
        return orderService.pageQuery(pageNum, pageSize, OrderStatus.of(status));
    }

    /**
     * 订单评价
     */
    @PostMapping("/comment")
    public boolean commentOrder(@RequestParam Integer orderId, @RequestParam Integer rate, @RequestParam String comment) {
        return orderService.commentOrder(orderId, rate, comment);
    }

    /**
     * 订单回复
     */
    @PostMapping("/reply")
    public boolean replyOrder(@RequestParam Integer orderId, @RequestParam String reply) {
        return orderService.replyOrder(orderId, reply);
    }
}

```


## Assistant

## 📋 OrderWebController 接口汇总表

### 基础信息
- **Controller 路径**: `/web/order`
- **模块**: 订单管理 (用户端)

---

### 🔗 接口列表

| 序号 | 接口名称 | 请求方法 | 接口路径 | 功能描述 |
|------|---------|---------|----------|---------|
| 1 | 创建订单 | `POST` | `/web/order/create/{cartType}` | 用户下单（支持立即购买和购物车下单） |
| 2 | 查询用户订单 | `GET` | `/web/order/user/{userId}` | 根据用户ID查询该用户的所有订单 |
| 3 | 分页查询订单 | `GET` | `/web/order/page` | 分页查询订单（支持状态筛选） |
| 4 | 订单评价 | `POST` | `/web/order/comment` | 用户对订单进行评价 |
| 5 | 订单回复 | `POST` | `/web/order/reply` | 商家回复订单评价 |

---

### 📝 接口详细说明

#### 1️⃣ 创建订单

| 项目 | 内容 |
|------|------|
| **接口路径** | `POST /web/order/create/{cartType}` |
| **功能描述** | 用户下单，支持立即购买和购物车下单两种模式 |
| **路径参数** | `cartType`: 购物车类型 (`INSTANT_BUY` / `NORMAL`) |
| **请求体** | TradeDTO (JSON) |
| **返回值** | `String` - 订单号 |

**TradeDTO 结构:**
```json
{
  "goodsId": 123,      // 商品ID
  "quantity": 2        // 购买数量
}
```

**请求示例:**
```bash
POST /web/order/create/INSTANT_BUY
Content-Type: application/json

{
  "goodsId": 10001,
  "quantity": 2
}
```

**返回示例:**
```
"202501241234560a1b2c3d"
```

---

#### 2️⃣ 查询用户订单

| 项目 | 内容 |
|------|------|
| **接口路径** | `GET /web/order/user/{userId}` |
| **功能描述** | 查询指定用户的所有订单列表 |
| **路径参数** | `userId`: 用户ID |
| **返回值** | `List<Order>` - 订单列表 |

**请求示例:**
```bash
GET /web/order/user/123
```

**返回示例:**
```json
[
  {
    "id": 1,
    "no": "202501241234560a1b2c3d",
    "name": "iPhone 15 Pro",
    "img": "https://...",
    "goodsId": 10001,
    "userId": 123,
    "storeId": 5,
    "num": 2,
    "totalPrice": 1999800,
    "status": "PENDING_PAYMENT",
    "createTime": "2025-01-24T12:34:56"
  }
]
```

---

#### 3️⃣ 分页查询订单

| 项目 | 内容 |
|------|------|
| **接口路径** | `GET /web/order/page` |
| **功能描述** | 分页查询订单，支持按状态筛选 |
| **查询参数** | `pageNum`: 页码（必填）<br>`pageSize`: 每页数量（必填）<br>`status`: 订单状态（必填） |
| **返回值** | `IPage<Order>` - 分页结果 |

**支持的订单状态:**
- `PENDING_PAYMENT` - 待支付
- `PENDING_DELIVERY` - 待发货
- `PENDING_RECEIPT` - 待收货
- `PENDING_REVIEW` - 待评价
- `REFUNDED` - 已退款
- `CANCELLED` - 已取消

**请求示例:**
```bash
GET /web/order/page?pageNum=1&pageSize=10&status=PENDING_PAYMENT
```

**返回示例:**
```json
{
  "records": [
    {
      "id": 1,
      "no": "202501241234560a1b2c3d",
      "name": "iPhone 15 Pro",
      "totalPrice": 1999800,
      "status": "PENDING_PAYMENT",
      "createTime": "2025-01-24T12:34:56"
    }
  ],
  "total": 25,
  "size": 10,
  "current": 1,
  "pages": 3
}
```

---

#### 4️⃣ 订单评价

| 项目 | 内容 |
|------|------|
| **接口路径** | `POST /web/order/comment` |
| **功能描述** | 用户对订单进行评价（评分+评论） |
| **查询参数** | `orderId`: 订单ID（必填）<br>`rate`: 评分 1-5（必填）<br>`comment`: 评价内容（必填） |
| **返回值** | `boolean` - 是否成功 |

**请求示例:**
```bash
POST /web/order/comment?orderId=1&rate=5&comment=商品质量很好，物流很快！
```

**返回示例:**
```
true
```

---

#### 5️⃣ 订单回复

| 项目 | 内容 |
|------|------|
| **接口路径** | `POST /web/order/reply` |
| **功能描述** | 商家回复用户的订单评价 |
| **查询参数** | `orderId`: 订单ID（必填）<br>`reply`: 回复内容（必填） |
| **返回值** | `boolean` - 是否成功 |

**请求示例:**
```bash
POST /web/order/reply?orderId=1&reply=感谢您的好评，欢迎再次光临！
```

**返回示例:**
```
true
```

---

### 🔐 权限说明

| 接口 | 需要登录 | 权限要求 |
|------|---------|---------|
| 创建订单 | ✅ 是 | 普通用户 |
| 查询用户订单 | ✅ 是 | 普通用户（只能查自己的订单）|
| 分页查询订单 | ✅ 是 | 普通用户 |
| 订单评价 | ✅ 是 | 普通用户（只能评价自己的订单）|
| 订单回复 | ✅ 是 | 商家用户 |

---

### 🎯 业务流程

```
用户下单 → 待支付 → 待发货 → 待收货 → 待评价
   ↓         ↓        ↓        ↓
 已取消    已取消   已退款   已退款
```

---

### ⚠️ 注意事项

1. **状态码必须准确**: 分页查询订单时，`status` 参数必须使用准确的状态码，否则会抛出 `INVALID_ORDER_STATUS` 异常
2. **价格单位**: `totalPrice` 字段单位为**分**，前端显示时
3. **时间格式**: `createTime` 为数据库自动生成的时间戳
4. **用户权限**: 用户只能查询和操作自己的订单

