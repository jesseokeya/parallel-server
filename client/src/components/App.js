import React, { useState } from "react";
import { Layout, Menu, Icon } from "antd";
import '../styles/app.css';

const { Header, Sider, Content } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => setCollapsed(!collapsed);

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" style={{ textAlign: 'center', marginTop: '5px', marginBottom: '5px' }}>
          <img src="/favicon.ico" alt="Smiley face" height="40" width="40" />
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1">
            <Icon type="security-scan" />
            <span>Analysis</span>
          </Menu.Item>
          <Menu.Item key="3">
            <Icon type="setting" />
            <span>Settings</span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: 0 }}>
          <Icon
            style={{ marginLeft: '15px', fontWeight: 'bold', fontSize: '20px' }}
            className="trigger"
            type={collapsed ? "menu-unfold" : "menu-fold"}
            onClick={toggle}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "#fff",
            minHeight: '85vh'
          }}
        >
          Content
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
