import React, { useRef, useState, useEffect } from 'react';
import { InboxOutlined, DatabaseOutlined } from '@ant-design/icons';
import {
  Layout,
  Menu,
  Upload,
  message,
  Button,
  Descriptions,
  DatePicker,
  Row,
  Col,
  Divider,
} from 'antd';
import { connect } from 'react-redux';
import { setSiderCollapse } from 'core/redux/settings/actions';
import moment from 'moment';

const { Sider } = Layout;
const { SubMenu } = Menu;
const { Dragger } = Upload;

const draggerProps = {
  name: 'file',
  multiple: false,
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};
const OPEN_KEYS = ['1', 'sub1', 'sub2', 'sub3'];

const MenuSide = (props) => {
  const { collapsed, dispatchSetSiderCollapse, isLoggedIn } = props;

  const now = moment();

  const parentRef = useRef(null);

  const [openKeys, setOpenKeys] = useState(OPEN_KEYS);

  const onOpenChange = (okeys) => setOpenKeys([...OPEN_KEYS, ...okeys]);

  const onCollapse = (c) => {
    const siderWidth = parentRef.current.offsetWidth;

    dispatchSetSiderCollapse(c, siderWidth);

    if (!isLoggedIn && !c) {
      message.info('Connect to your Ethereum wallet to interact with the dApp');
    }
  };

  useEffect(
    function openSideBar() {
      const siderWidth = parentRef.current.offsetWidth;

      if (isLoggedIn) {
        dispatchSetSiderCollapse(false, siderWidth);
      } else {
        dispatchSetSiderCollapse(true, siderWidth);
      }
    },
    [isLoggedIn],
  );

  return (
    <div ref={parentRef}>
      <Sider
        reverseArrow
        width="30vw"
        collapsible={isLoggedIn}
        collapsed={collapsed}
        onCollapse={onCollapse}
      >
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          forceSubMenuRender
        >
          {!collapsed && (
            <>
              <SubMenu key="sub1">
                {
                  // eslint-disable-next-line
                }
                <Dragger {...draggerProps}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Drag and drop a geoJSON file to this area</p>
                  <p className="ant-upload-hint">It will be loaded into your browser</p>
                </Dragger>
              </SubMenu>
              <SubMenu key="sub2" icon={<DatabaseOutlined />} title="Loaded File Status">
                <Row>
                  <Col span={12} offset={3}>
                    <Descriptions.Item>Validated: Yes</Descriptions.Item>
                  </Col>
                </Row>
                <Divider orientation="left" />
                <Row>
                  <Col span={12} offset={3}>
                    Pick geoJSON date:
                  </Col>
                </Row>

                <Row>
                  <Col span={12} offset={3}>
                    <DatePicker
                      id="cT"
                      format="YYYY-MM-DD HH:mm"
                      showTime={{
                        defaultValue: now,
                        format: 'HH:mm',
                      }}
                    />{' '}
                  </Col>
                </Row>
              </SubMenu>
              <SubMenu key="sub3">
                <Button block>Register</Button>
              </SubMenu>
            </>
          )}
        </Menu>
      </Sider>
    </div>
  );
};

const mapStateToProps = (state) => ({
  collapsed: state.settings.collapsed,
  isLoggedIn: state.login.isLoggedIn,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetSiderCollapse: (collapsed, siderWidth) =>
    dispatch(setSiderCollapse(collapsed, siderWidth)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuSide);
