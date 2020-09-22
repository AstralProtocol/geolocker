import React, { useRef } from 'react';
import { DesktopOutlined, FileOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { connect } from 'react-redux';
import { setSiderCollapse } from 'core/redux/settings/actions';

const { Sider } = Layout;
const { SubMenu } = Menu;

const MenuSide = (props) => {
  const { collapsed, dispatchSetSiderCollapse } = props;
  const parentRef = useRef(null);

  const onCollapse = (c) => {
    const siderWidth = parentRef.current.offsetWidth;

    dispatchSetSiderCollapse(c, siderWidth);
  };

  return (
    <div ref={parentRef}>
      <Sider reverseArrow width="30vw" collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1"> </Menu.Item>
          <Menu.Item key="2" icon={<DesktopOutlined />}>
            Option 2
          </Menu.Item>
          <SubMenu key="sub1" icon={<UserOutlined />} title="User">
            <Menu.Item key="3">Tom</Menu.Item>
            <Menu.Item key="4">Bill</Menu.Item>
            <Menu.Item key="5">Alex</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
            <Menu.Item key="6">Team 1</Menu.Item>
            <Menu.Item key="8">Team 2</Menu.Item>
          </SubMenu>
          <Menu.Item key="9" icon={<FileOutlined />} />
        </Menu>
      </Sider>
    </div>
  );
};

const mapStateToProps = (state) => ({
  collapsed: state.settings.collapsed,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetSiderCollapse: (collapsed, siderWidth) =>
    dispatch(setSiderCollapse(collapsed, siderWidth)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuSide);
