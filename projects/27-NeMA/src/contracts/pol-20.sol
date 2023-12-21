pragma solidity >= 0.4.15 < 0.9.0;

// 该合约用于 Polkadot 生态中 pol-20 铭文的现货交易

contract Pol20SpotTrade {
    // 订单结构
    struct Order {
        string tick; // 铭文类型
        uint256 amount; // 交易数量
        uint256 price; // 交易价格
        uint256 deadline; // 交易截止时间
        address seller; // 卖家地址
        bool isFilled; // 订单是否已完成
    }

    // 订单列表
    mapping(bytes32 => Order) public orders;

    // 事件
    event OrderCreated(bytes32 orderId, string tick, uint256 amount, uint256 price, uint256 deadline, address seller);
    event OrderFilled(bytes32 orderId, address buyer);

    // 创建订单
    function createOrder(
        string memory tick,
        uint256 amount,
        uint256 price,
        uint256 deadline
    ) public {
        // 计算订单 ID
        bytes32 orderId = keccak256(abi.encodePacked(tick, amount, price, deadline, msg.sender));

        // 创建订单
        Order memory order = Order({
            tick: tick,
            amount: amount,
            price: price,
            deadline: deadline,
            seller: msg.sender,
            isFilled: false
        });

        // 将订单添加到列表中
        orders[orderId] = order;

        // 触发事件
        emit OrderCreated(orderId, tick, amount, price, deadline, msg.sender);
    }

    // 取消订单
    function cancelOrder(bytes32 orderId) public {
        // 只有卖家才能取消订单
        require(orders[orderId].seller == msg.sender, "Only the seller can cancel the order");

        // 标记订单已完成
        orders[orderId].isFilled = true;

        // 触发事件
        emit OrderFilled(orderId, address(0));
    }

    // 交易
    function trade(bytes32 orderId) public payable {
        // 订单必须存在
        require(orders[orderId].seller != address(0), "Order does not exist");

        // 订单必须未完成
        require(!orders[orderId].isFilled, "Order is already filled");

        // 订单必须在截止时间之前
        require(block.timestamp <= orders[orderId].deadline, "Order has expired");

        // 买家必须支付足够的金额
        require(msg.value >= orders[orderId].price * orders[orderId].amount, "Insufficient funds");

        // 将资产转移给卖家
        payable(orders[orderId].seller).transfer(msg.value);

        // 将铭文资产转移给买家
        // TODO: 这里需要调用 Polkadot API 将铭文资产转移给买家

        // 标记订单已完成
        orders[orderId].isFilled = true;

        // 触发事件
        emit OrderFilled(orderId, msg.sender);
    }
}
