import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  Fragment
} from "react";
import { Layout, Menu, Icon, Alert } from "antd";
import { Store } from "../store";
import { fetchDataAction } from "../actions";
import "../styles/app.css";
import Tree from "react-d3-tree";

const { Header, Sider, Content } = Layout;

const getQueries = _ => {
  const search = window.location.search;
  return search.length ? search : null;
};

function App() {
  let domainContext = null,
    otherDomainContext = null;
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const { state, dispatch } = useContext(Store);
  const [collapsed, setCollapsed] = useState(false);
  const [snapshots, setSnapshots] = useState({
    domain: null,
    otherDomain: null
  });

  const toggle = _ => setCollapsed(!collapsed);

  const deepCopy = context => {
    const root = JSON.parse(context);
    const arr = [root];
    while (arr.length) {
      const node = arr.shift();
      node["name"] = node.localName;
      delete node.localName;
      arr.push(...node.children);
    }
    return root;
  };

  let treeContainer = useRef();

  useEffect(
    _ => {
      const { domain, otherDomain } = snapshots;
      const query = getQueries();
      if (!domain && !otherDomain) fetchDataAction(query, dispatch);
      setSnapshots(state.snapshots);
      if (treeContainer && treeContainer.current) {
        const dimensions = treeContainer.current.getBoundingClientRect();
        setTranslate({
          x: 10,
          y: dimensions.height / 2
        });
      }
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
                <div className="contain-tree">
                  <div className="custom-container">
                    <div
                      id="treeWrapper"
                      style={{
                        width: "100%",
                        height: "100vh",
                        textAlign: "center"
                      }}
                      ref={treeContainer}
                    >
                      <Tree
                        data={domainContext}
                        collapsible={true}
                        transitionDuration={0}
                        zoom={0.5}
                        translate={translate}
                      />
                    </div>
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
                <div className="contain-tree">
                  <div className="custom-container">
                    <div
                      id="treeWrapper"
                      style={{
                        width: "100%",
                        height: "100vh",
                        textAlign: "center"
                      }}
                      ref={treeContainer}
                    >
                      <Tree
                        data={otherDomainContext}
                        collapsible={true}
                        transitionDuration={0}
                        zoom={0.5}
                        translate={translate}
                      />
                    </div>
                  </div>
                </div>
              </Fragment>
            )}
          </div>
          <br />
          <div style={{ textAlign: "center" }}>
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
                <img
                  style={{ margin: "2%" }}
                  src={snapshots.domain.screenshot}
                  width="600"
                  height="600"
                  alt="domain"
                />
                <img
                  style={{ margin: "2%" }}
                  src={snapshots.otherDomain.screenshot}
                  width="600"
                  height="600"
                  alt="OtherDomain"
                />
              </Fragment>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
