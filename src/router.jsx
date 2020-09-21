import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import Loadable from 'react-loadable';
import Loader from 'components/LayoutComponents/Loader/index';
import MainLayout from 'layouts';

const loadable = (loader) =>
  Loadable({
    loader,
    delay: false,
    loading: () => <Loader spinning />,
  });

const routes = [
  // Feed
  {
    path: '/customization',
    component: loadable(() => import('pages/Customization')),
    exact: true,
  },
  // Home
  {
    path: '/map',
    component: loadable(() => import('pages/Map')),
    exact: true,
  },
];

const Router = (props) => {
  const { history } = props;

  return (
    <ConnectedRouter history={history}>
      <MainLayout>
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/map" />} />
          {routes.map((route) => (
            <Route
              path={route.path}
              component={route.component}
              key={route.path}
              exact={route.exact}
            />
          ))}
        </Switch>
      </MainLayout>
    </ConnectedRouter>
  );
};

export default Router;
