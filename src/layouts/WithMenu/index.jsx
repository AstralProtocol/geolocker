import React from 'react';
import { BackTop, Layout, Affix } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import MenuTop from 'components/LayoutComponents/Menu/MenuTop';
import Modals from 'components/Modals';
import classNames from 'classnames';

function MainLayout(props) {
  const {
    isBorderless,
    isSquaredBorders,
    isFixedWidth,
    isMenuShadow,
    isMenuTop,
    children,
    createModal,
    updateNameModal,
  } = props;

  return (
    <Layout
      className={classNames({
        settings__borderLess: isBorderless,
        settings__squaredBorders: isSquaredBorders,
        settings__fixedWidth: isFixedWidth,
        settings__menuShadow: isMenuShadow,
        settings__menuTop: isMenuTop,
      })}
    >
      <Affix>
        <MenuTop />
      </Affix>
      <BackTop />
      <Modals.CreateModal createModal={createModal} />
      <Modals.UpdateNameModal updateNameModal={updateNameModal} />
      <Layout.Content style={{ height: '100%', position: 'relative' }}>
        <div className="utils__content">{children}</div>
      </Layout.Content>
    </Layout>
  );
}

const mapStateToProps = (state) => ({
  isBorderless: state.settings.isBorderless,
  isSquaredBorders: state.settings.isSquaredBorders,
  isFixedWidth: state.settings.isFixedWidth,
  isMenuShadow: state.settings.isMenuShadow,
  isMenuTop: state.settings.isMenuTop,
  createModal: state.modals.createModal,
  updateNameModal: state.modals.updateNameModal,
});

export default withRouter(connect(mapStateToProps, null)(MainLayout));
