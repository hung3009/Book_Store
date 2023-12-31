import React, { useState } from "react";
import { Modal, Input, Button, Select } from "antd";
import axios from "axios";
import { message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  ContactsOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
const { Option } = Select;

const style = { margin: "10px 8px" };

const AddUser = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
    phonenumber: "",
    role: "",
    id_card: "",
  });
  const token = useSelector((state) => state.role.token);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    handleSubmit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const handleRoleChange = (value) => {
    setUser({ ...user, role: value });
  };

  async function handleSubmit() {
    console.log("user", user);
    if (
      !user.email ||
      !user.password ||
      !user.username ||
      !user.phonenumber ||
      !user.role ||
      !user.id_card
    ) {
      message.warning("Please fill in all the information");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_PORT}/adduser`,
        {
          email: user.email,
          password: user.password,
          username: user.username,
          phonenumber: user.phonenumber,
          role: user.role,
          id_card: user.id_card,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response", response);
      if (response.data === "addfail") {
        message.warning("User already exists");
      }
      if (response.data === "added") {
        message.success("Add success");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.log(error.response);
      if (error.response && error.response.status === 400) {
        message.error(error.response.data);
      } else {
        message.error("Something went wrong. Please try again later.");
      }
    }
  }

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Add User
      </Button>
      <Modal
        title="Add User"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div>
          <div style={style}>
            <Input
              placeholder="Email"
              prefix={<MailOutlined />}
              name="email"
              type="email"
              value={user.email}
              onChange={handleChange}
            />
          </div>
          <div style={style}>
            <Input.Password
              placeholder="Password"
              prefix={<LockOutlined />}
              name="password"
              value={user.password}
              onChange={handleChange}
            />
          </div>
          <div style={style}>
            <Input
              placeholder="Username"
              prefix={<UserOutlined />}
              name="username"
              value={user.username}
              onChange={handleChange}
            />
          </div>
          <div style={style}>
            <Input
              placeholder="Phone Number"
              prefix={<PhoneOutlined />}
              name="phonenumber"
              value={user.phonenumber}
              onChange={handleChange}
            />
          </div>

          <div style={style}>
            <Input
              placeholder="ID Card"
              prefix={<IdcardOutlined />}
              name="id_card"
              value={user.id_card}
              onChange={handleChange}
            />
          </div>
          <div style={style}>
            <Select
              style={{ width: "100%" }}
              placeholder="Role"
              prefix={<ContactsOutlined />}
              name="role"
              value={user.role}
              onChange={handleRoleChange}
            >
              <Option value="employee">Employee</Option>
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
            </Select>
          </div>
          <Button type="primary" htmlType="submit" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default AddUser;
