import React, { useState, useEffect, useContext, Fragment } from "react";
import { Layout, Menu, Icon, Alert, Modal, Tag } from "antd";
import { Store } from "../store";
import { fetchDataAction } from "../actions";
import Tree from "react-tree-graph";
import "../styles/app.css";
import "react-tree-graph/dist/style.css";

const { Header, Sider, Content } = Layout;

const getQueries = _ => {
  const search = window.location.search;
  return search.length ? search : null;
};

function App() {
  let domainContext = null,
    otherDomainContext = null;
  const { state, dispatch } = useContext(Store);
  const [collapsed, setCollapsed] = useState(false);
  const [snapshots, setSnapshots] = useState({
    domain: null,
    otherDomain: null
  });
  const [visible, setVisible] = useState(false);
  const [attributes, setAttributes] = useState({});

  const toggle = _ => setCollapsed(!collapsed);

  const showModal = _ => {
    setVisible(true);
  };
  const handleOk = _ => {
    setVisible(false);
  };
  const handleCancel = _ => {
    setVisible(false);
  };

  const deepCopy = context => {
    const root = JSON.parse(context);
    const arr = [root];
    while (arr.length) {
      const node = arr.shift();
      node["name"] = node.localName;
      if (node.attributes && Object.keys(node.attributes).length > 0) {
        node["gProps"] = {
          onClick: _ => {
            setVisible(true);
            setAttributes({ name: node.name, ...node.attributes });
          }
        };
      }
      delete node.localName;
      arr.push(...node.children);
    }
    return root;
  };

  const displayAttributes = _ => {
    const name = attributes.name;
    delete attributes.name;
    return (
      <Fragment>
        <u>
          <span>
            <b>TagName</b>
          </span>
          : <Tag color="geekblue">{name}</Tag>
        </u>
        <br />
        {Object.keys(attributes).map(attribute => (
          <div style={{ marginTop: "3%" }}>
            <span>
              <b>{attribute.trim()}</b>
            </span>
            : <Tag color="magenta">{attributes[attribute].trim()}</Tag>
          </div>
        ))}
      </Fragment>
    );
  };

  useEffect(
    _ => {
      const { domain, otherDomain } = snapshots;
      const query = getQueries();
      if (!domain && !otherDomain) fetchDataAction(query, dispatch);
      setSnapshots(state.snapshots);
    },
    [state, snapshots, dispatch]
  );

  if (
    snapshots.domain &&
    snapshots.otherDomain &&
    snapshots.domain.snapshot &&
    snapshots.otherDomain.snapshot
  ) {
    domainContext = deepCopy(snapshots.domain.snapshot);
    otherDomainContext = deepCopy(snapshots.otherDomain.snapshot);
  }

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          className="logo"
          style={{
            textAlign: "center",
            marginTop: "5px",
            marginBottom: "5px"
          }}
        >
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
            style={{
              marginLeft: "15px",
              fontWeight: "bold",
              fontSize: "20px"
            }}
            className="trigger"
            type={collapsed ? "menu-unfold" : "menu-fold"}
            onClick={toggle}
          />
        </Header>
        <Content className="app-content">
          <div className="container">
            {domainContext && (
              <Fragment>
                <div
                  style={{
                    margin: "1%",
                    textAlign: "center",
                    fontWeight: "bold"
                  }}
                >
                  <Alert
                    message={snapshots.domain.domain}
                    description={`Title: "${snapshots.domain.title}", Depth: "${snapshots.domain.depth}", Browser: "${snapshots.domain.browser}"`}
                    type="warning"
                  />
                </div>
                <div class="contain-tree">
                  <div className="custom-container">
                    <Tree
                      data={domainContext}
                      height={800 * (Number(snapshots.domain.depth) / 8)}
                      width={2000}
                    />
                  </div>
                </div>
              </Fragment>
            )}
            <br />
            {otherDomainContext && (
              <Fragment>
                <div
                  style={{
                    margin: "1%",
                    textAlign: "center",
                    fontWeight: "bold"
                  }}
                >
                  <Alert
                    message={snapshots.otherDomain.domain}
                    description={`Title: "${snapshots.otherDomain.title}", Depth: "${snapshots.otherDomain.depth}", Browser: "${snapshots.otherDomain.browser}"`}
                    type="warning"
                  />
                </div>
                <div class="contain-tree">
                  <div className="custom-container">
                    <Tree
                      data={otherDomainContext}
                      height={800 * (Number(snapshots.otherDomain.depth) / 8)}
                      width={2000}
                    />
                  </div>
                </div>
              </Fragment>
            )}
          </div>
          <br />
          <div style={{ textAlign: 'center' }}>
            {otherDomainContext && domainContext && (
              <Fragment>
                 <div
                  style={{
                    margin: "1%",
                    textAlign: "center",
                    fontWeight: "bold"
                  }}
                >
                  <Alert
                    message={`Screenshot between analysis between ${snapshots.domain.domain} and ${snapshots.otherDomain.domain}`}
                    type="warning"
                  />
                </div>
                <img style={{ margin: '2%' }} src={snapshots.domain.screenshot} width="600" height="600" alt="domain" />
                <img style={{ margin: '2%' }} src={snapshots.otherDomain.screenshot} width="600" height="600" alt="OtherDomain" />
              </Fragment>
            )}
          </div>
        </Content>
      </Layout>
      <Modal
        title="Element Attributes"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div style={{ overflow: "scroll" }}>
          {Object.keys(attributes).length > 0 && visible && displayAttributes()}
        </div>
      </Modal>
    </Layout>
  );
}

export default App;
