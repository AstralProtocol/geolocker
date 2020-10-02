import { all } from 'redux-saga/effects';
import contracts from 'core/redux/contracts/sagas';
import gravatars from 'core/redux/gravatars/sagas';
import login from 'core/redux/login/sagas';
import menu from 'core/redux/menu/sagas';
import settings from 'core/redux/settings/sagas';
import spatialAssets from 'core/redux/spatial-assets/sagas2';

export default function* rootSaga() {
  yield all([contracts(), gravatars(), login(), menu(), settings(), spatialAssets()]);
}
