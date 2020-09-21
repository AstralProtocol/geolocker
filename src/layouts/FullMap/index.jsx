import React, { useRef, useEffect } from 'react';
import { Layout, Affix } from 'antd';
import { connect } from 'react-redux';
import MenuTop from 'components/LayoutComponents/Menu/MenuTop';
import MenuSide from 'components/LayoutComponents/Menu/MenuSide';
import { setMapSizea } from 'core/redux/settings/actions';

const { Content } = Layout;

const FullMapLayout = (props) => {
  const { children, dispatchSetMapSize } = props;

  const parentRef = useRef(null);

  useEffect(() => {
    if (parentRef.current) {
      dispatchSetMapSize({
        width: parentRef.current.offsetWidth,
        height: parentRef.current.offsetHeight,
      });
    }
  }, [parentRef]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout className="site-layout">
        <Affix>
          <MenuTop />
        </Affix>
        <Content style={{ height: '100%', position: 'relative' }}>
          <div className="utils__content">
            <div ref={parentRef}>{children}</div>
          </div>
        </Content>
      </Layout>
      <MenuSide />
    </Layout>
  );
};

const mapDispatchToProps = (dispatch) => ({
  dispatchSetMapSize: (dimensions) => dispatch(setMapSizea(dimensions)),
});

export default connect(null, mapDispatchToProps)(FullMapLayout);
