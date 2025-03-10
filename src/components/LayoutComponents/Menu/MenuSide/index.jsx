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
  Row,
  Col,
  Tag,
  Select,
  Progress,
} from 'antd';
import { connect } from 'react-redux';
import { setSiderCollapse } from 'core/redux/settings/actions';
import {
  setFileList,
  setSpatialAsset,
  setSelectedCog,
  unloadCogs,
  registerSpatialAsset,
} from 'core/redux/spatial-assets/actions';
import validator from '@astraldao/stac-validator-js';

const { Sider } = Layout;
const { SubMenu } = Menu;
const { Dragger } = Upload;
const { Option } = Select;

const OPEN_KEYS = ['1', 'sub1', 'sub2', 'sub3'];

const MenuSide = (props) => {
  const {
    collapsed,
    dispatchSetSiderCollapse,
    isLoggedIn,
    dispatchSetSpatialAsset,
    loadedCogs,
    dispatchSetSelectedCog,
    selectedCog,
    dispatchUnloadCogs,
    dispatchSetFileList,
    fileList,
    dispatchRegisterSpatialAsset,
    spatialAssetLoaded,
    registeringSpatialAsset,
    spatialAssetRegistered,
  } = props;

  const parentRef = useRef(null);
  const [openKeys, setOpenKeys] = useState(OPEN_KEYS);
  const [validStacItem, setValidStacItem] = useState(false);
  const [rasterSelector, setRasterSelector] = useState(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const draggerProps = {
    accept: 'application/JSON',
    name: 'file',
    multiple: false,
    beforeUpload(file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        setValidStacItem(true);
        const json = JSON.parse(e.target.result);
        console.log(json);
        setLoadProgress(50);
        const result = await validator(json);
        console.log(result);
        dispatchSetSpatialAsset(JSON.parse(e.target.result), true);
        setLoadProgress(100);
      };
      reader.readAsText(file);

      return false;
    },
    onChange(info) {
      setLoadProgress(0);
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
        setValidStacItem(false);
        dispatchSetSpatialAsset({}, false);
        dispatchUnloadCogs();
      }

      dispatchSetFileList(newFileList);
    },
  };

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

  useEffect(() => {
    if (loadedCogs) {
      const newRasterSelectorOptions = [];
      loadedCogs.forEach((cog) => {
        newRasterSelectorOptions.push(
          <Option value={cog} key={cog}>
            `${cog.substr(-10)}`
          </Option>,
        );
      });

      setRasterSelector(newRasterSelectorOptions);
    } else {
      setRasterSelector(null);
    }
  }, [loadedCogs]);

  const handleChange = (value) => {
    dispatchSetSelectedCog(value);
  };

  const handleRegister = () => {
    if (spatialAssetLoaded) {
      dispatchRegisterSpatialAsset();
    } else {
      message.info('No valid stac item loaded');
    }
  };

  let validationTag;

  if (validStacItem && fileList.length > 0) {
    validationTag = (
      <Tag icon={<CheckCircleOutlined />} color="success">
        Valid Stac Item
      </Tag>
    );
  } else if (!validStacItem && fileList.length > 0) {
    validationTag = (
      <Tag icon={<CloseCircleOutlined />} color="error">
        Invalid Stac Item
      </Tag>
    );
  } else if (fileList.length === 0) {
    validationTag = (
      <Tag icon={<ClockCircleOutlined />} color="default">
        Waiting for a Stac Item
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
        {!collapsed && (
          <Menu
            theme="dark"
            mode="inline"
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            forceSubMenuRender
          >
            <SubMenu key="sub1">
              {
                // eslint-disable-next-line
              }
              <Dragger {...draggerProps} fileList={fileList}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Drag and drop a STAC Item to this area</p>
                <p className="ant-upload-hint">It will be loaded into your browser</p>
              </Dragger>
            </SubMenu>
            <SubMenu key="sub2" icon={<DatabaseOutlined />} title="Loaded File Status">
              <Row>
                <Col span={12} offset={3}>
                  <Descriptions.Item>
                    <Progress percent={loadProgress} status="active" />
                  </Descriptions.Item>
                  <Descriptions.Item>{validationTag}</Descriptions.Item>
                </Col>
              </Row>
              <Menu.Divider orientation="left" />
              {loadedCogs && (
                <div style={{ marginTop: '25px' }}>
                  <Row>
                    <Col span={12} offset={3}>
                      Select Raster to View:
                    </Col>
                  </Row>
                  <Row>
                    <Select
                      defaultValue={selectedCog}
                      onChange={handleChange}
                      style={{ width: '100%', marginTop: '25px' }}
                    >
                      {rasterSelector}
                    </Select>
                  </Row>
                </div>
              )}
            </SubMenu>
            <SubMenu key="sub3">
              {!spatialAssetRegistered ? (
                <Button block onClick={() => handleRegister()} loading={registeringSpatialAsset}>
                  Register geoNFT
                </Button>
              ) : (
                <Descriptions.Item>
                  <Tag icon={<CheckCircleOutlined />} color="success">
                    geoNFT successfuly registered
                  </Tag>
                </Descriptions.Item>
              )}
            </SubMenu>
          </Menu>
        )}
      </Sider>
    </div>
  );
};

const mapStateToProps = (state) => ({
  collapsed: state.settings.collapsed,
  isLoggedIn: state.login.isLoggedIn,
  loadedCogs: state.spatialAssets.loadedCogs,
  selectedCog: state.spatialAssets.selectedCog,
  fileList: state.spatialAssets.fileList,
  spatialAssetLoaded: state.spatialAssets.spatialAssetLoaded,
  registeringSpatialAsset: state.spatialAssets.registeringSpatialAsset,
  spatialAssetRegistered: state.spatialAssets.spatialAssetRegistered,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetFileList: (fileList) => dispatch(setFileList(fileList)),
  dispatchSetSiderCollapse: (collapsed, siderWidth) =>
    dispatch(setSiderCollapse(collapsed, siderWidth)),
  dispatchSetSpatialAsset: (spatialAsset, spatialAssetLoaded) =>
    dispatch(setSpatialAsset(spatialAsset, spatialAssetLoaded)),
  dispatchSetSelectedCog: (selectedCog) => dispatch(setSelectedCog(selectedCog)),
  dispatchUnloadCogs: () => dispatch(unloadCogs()),
  dispatchRegisterSpatialAsset: () => dispatch(registerSpatialAsset()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuSide);
