import React, { useRef, useState, useEffect } from 'react';
import {
  InboxOutlined,
  DatabaseOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
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
  Tag,
} from 'antd';
import { connect } from 'react-redux';
import { setSiderCollapse } from 'core/redux/settings/actions';
import moment from 'moment';
import geojsonhint from '@mapbox/geojsonhint';

const { Sider } = Layout;
const { SubMenu } = Menu;
const { Dragger } = Upload;

const OPEN_KEYS = ['1', 'sub1', 'sub2', 'sub3'];

const MenuSide = (props) => {
  const { collapsed, dispatchSetSiderCollapse, isLoggedIn } = props;

  const now = moment();

  const parentRef = useRef(null);
  const [openKeys, setOpenKeys] = useState(OPEN_KEYS);
  const [fileList, setFileList] = useState([]);
  const [validGeoJSON, setValidGeoJSON] = useState(false);

  const draggerProps = {
    accept: 'application/JSON',
    name: 'file',
    multiple: false,
    beforeUpload(file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const hintResult = geojsonhint.hint(e.target.result);
        if (hintResult !== undefined && hintResult.length === 0) {
          setValidGeoJSON(true);
        }
      };
      reader.readAsText(file);

      return false;
    },
    onChange(info) {
      const { fileList: fL } = info;
      let newFileList = fL;
      // 1. Limit the number of uploaded files
      // Only to show two recent uploaded files, and old ones will be replaced by the new

      const filtered = newFileList.filter((f) => {
        if (f.type !== 'application/json') {
          message.info('This box only accepts json formats');
        }
        return f.type === 'application/json';
      });

      newFileList = filtered.slice(-1);

      if (newFileList !== undefined && newFileList.length === 0) {
        setValidGeoJSON(false);
      }

      setFileList(newFileList);
    },
  };

  console.log(validGeoJSON);
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
      if (isLoggedIn) {
        const siderWidth = parentRef.current.offsetWidth;

        dispatchSetSiderCollapse(false, siderWidth);
      }
    },
    [isLoggedIn],
  );

  let validationTag;

  if (validGeoJSON && fileList.length > 0) {
    validationTag = (
      <Tag icon={<CheckCircleOutlined />} color="success">
        Valid geoJSON file
      </Tag>
    );
  } else if (!validGeoJSON && fileList.length > 0) {
    validationTag = (
      <Tag icon={<CloseCircleOutlined />} color="error">
        Invalid geoJSON file
      </Tag>
    );
  } else if (fileList.length === 0) {
    validationTag = (
      <Tag icon={<ClockCircleOutlined />} color="default">
        Waiting for a file
      </Tag>
    );
  }

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
                <Dragger {...draggerProps} fileList={fileList}>
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
                    <Descriptions.Item>{validationTag}</Descriptions.Item>
                  </Col>
                </Row>
                <Divider orientation="left" />
                <Row>
                  <Col span={20} offset={3}>
                    geoJSON timestamp:{'    '}
                    <DatePicker
                      id="cT"
                      format="YYYY-MM-DD HH:mm"
                      showTime={{
                        defaultValue: now,
                        format: 'HH:mm',
                      }}
                    />
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
