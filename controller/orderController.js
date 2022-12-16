const OrderItem = require('../model/order-item')
const Order = require('../model/order')
const orderItem = require('../model/order-item')



exports.postOrder = async (req, res) => {
    //at first send the order item to the model OrderItem
    const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })
        newOrderItem = await newOrderItem.save()
        //after saving the data new created Id is set to orderItemsIds
        return newOrderItem._id
    }))
    const orderItemsIdResoved = await orderItemsIds
    //calculating total price of order by using reduce
    const totalPrices = await Promise.all(orderItemsIdResoved.map(async (orderItemId) => {
        const itemOrder = await OrderItem.findById(orderItemId).populate('product', 'price')
        // populate('product','price') --product is from order-item model and price is from product model
        const total = itemOrder.quantity * itemOrder.product.price
        return total
        //returnn in array like [60,100,600] for this we ll do 
    }))
    const Amount = totalPrices.reduce((a, b) => a + b, 0)
    //shiping address
    let order = new Order({
        orderItems: orderItemsIdResoved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        amount: Amount,
        user: req.body.user
    })
    order = await order.save()
    if (!order) {
        return res.status(400).json({ err: 'Order cannot be completed' })
    }
    res.send(order)
}

exports.orderList = async (req, res) => {
    try {
        console.log("this is order list function")
        const order = await Order.find().populate('user', 'name').sort({ createdAt: -1 })
        console.log(order, 'hello order')
        //createdAt:-1 is to show descending order
        res.send(order)
    } catch (err) {
        return res.status(400).json({ err: "Seomething Went wrong" })
    }
}

exports.orderDetails = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name')
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'product', populate: 'category'
                }
            })
        res.send(order)
    }
    catch (err) {
        return res.status(400).json({ err: "Seomething Went wrong" })
    }
}

exports.updateStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id,
            {
                status: req.body.status
            }, { new: true }
        )
        res.send(order)
    }
    catch (err) {
        return res.status(400).json({ err: "Seomething Went wrong" })
    }
}

exports.deleteOrder = (req, res) => {
    Order.findByIdAndRemove(req.params.id).then(async order => {
        if (order) {
            await order.orderItems.map(async orderItem => {
                await orderItem.findByIdAndRemove(orderItem)
            })
            return res.json({ message: "The order has been deleted" })
        }
        else res.status(500).json({ error: 'failed to delete order' })
    })
        .catch(err => {
            return res.status(500).json({ error: err })
        })
}

//user orders
exports.userOrders=async(req,res)=>{
    const userOrderList= await  Order.find({user:req.params.id})
    .populate({
        path:'orderItem',
        populate:{
            path:'product',
            populate:'category'
        }
    }).sort({createdAt:-1})
    if(!userOrderList){
        return res.status(500).json({error:"Something went wrong"})
    }
    res.send(userOrderList)
}