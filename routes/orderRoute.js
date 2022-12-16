const express=require('express')
const { postOrder, orderDetails, orderList, updateStatus, deleteOrder, userOrders } = require("../controller/orderController");
const router = express.Router();


router.post("/postorder",postOrder)
router.get("/orderlist",orderList)
router.get("/orderdetails/:id",orderDetails)
router.put("/orderstatus/:id",updateStatus)
router.delete("/deleteorder/:id",deleteOrder)
router.get('/userorders/:id',userOrders)



module.exports = router