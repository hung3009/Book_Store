import React, { useState, useEffect } from "react";
import { Card, Space, Button, message } from "antd";
import Copytext from "../../User/myorder/copytext";
import { resetPayment } from "../../../redux/features/paymentSlice";
import { resetOrder } from "../../../redux/features/orderSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
const CardConfirmOrder = (props) => {
  const [order_volumes, setOrder_volume] = useState([]);
  const [getAllOrder, setGetAllOrder] = useState([]);
  const { orderid } = props;
  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_API_PORT}/findorder`, {
        id_order: orderid,
      })
      .then((res) => {
        // const { order_volume } = res.data;
        setOrder_volume(res.data);
        if (res.data.length > 0) {
          const firstOrder = res.data[0];
          if (Array.isArray(res.data) && firstOrder.order_volume) {
            const mappedData = firstOrder.order_volume.map((item) => ({
              id_book: item.id_book,
              quantity: item.quantity,
            }));
            setGetAllOrder(mappedData); // Lưu mảng mới vào orderList
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [orderid]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const handleConfirm = () => {
    axios
      .put(`${process.env.REACT_APP_API_PORT}/setstateorder`, {
        id_order: orderid,
        state: 3,
      })
      .then((res) => {
        setGetAllOrder(res.data);
        setLoading(false);
      });
    message.success("Confirm Order Success");

    dispatch(resetPayment());
    dispatch(resetOrder());

    setTimeout(() => {
      window.location.reload(); 
    }, 2000);
  };

  return (
    <>
      <Space
        style={{
          backgroundColor: "#f0f2f5",
          minHeight: "100px",
          minWidth: "500px",
          borderRadius: "5px",
          border: "1px solid #d9d9d9",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          padding: "0 0 10px 0",
        }}
        align="center"
      >
        <Copytext text={`${props.orderid}`} />
        <Space
          style={{
            display: "flex",
            minHeight: "100px",
            minWidth: "500px",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            display: "flex",
            flexDirection: "column"
          }}
        >
          {order_volumes.map((order, index) => (
            <Card
              key={index}
              style={{
                width: 300,
                margin: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <p><b>Email:</b> {order.email}</p>
              <p><b>Total:</b> {order.price_total.toFixed(2)}</p>
            </Card>
          
          ))}
          {Array.isArray(getAllOrder) && getAllOrder.map((order, index) => (
            <Card
              key={index}
              style={{
                width: "100%",
                marginBottom: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <p><b>ID Book:</b> {order.id_book}</p>
              <p><b>Quantity:</b> {order.quantity}</p>
            </Card>
          ))}
        </Space>
        <Button style={{ float: "right" }} type="primary"
          onClick={handleConfirm}
        >
          ConfirmOrder
        </Button>
      </Space>

      <br />
    </>
  );
};
export default CardConfirmOrder;
