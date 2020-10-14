import { all, takeEvery, put, call, select } from 'redux-saga/effects';
import axios from 'axios';
import AstralClient from '@astraldao/astral-protocol-core';
import { actions } from './actions';

const getSpatialAssetsState = (state) => state.spatialAssets;

async function fetchFromTilesRdnt(loadedCogs) {
  const responses = [];
  const loadedTiffJson = [];

  await Promise.all(
    loadedCogs.map(async (cog) => {
      const response = await axios.get(`http://tiles.rdnt.io/tiles?url=${cog}`);
      responses.push({
        ...response,
        cog,
      });
    }),
  );

  responses.forEach((response) => {
    if (response.status === 200) {
      loadedTiffJson.push({
        ...response.data,
        cog: response.cog,
      });
    } else {
      loadedTiffJson.push({
        status: 'error fetching resource',
        cog: response.cog,
      });
    }
  });
  return loadedTiffJson;
}

function* LOAD_COGS_SAGA(action) {
  const { payload } = action;
  const { loadedCogs } = payload;

  const loadedTiffJson = yield call(fetchFromTilesRdnt, loadedCogs);

  yield put({
    type: actions.COGS_LOADED,
    payload: {
      loadedCogs,
      loadedTiffJson,
    },
  });
}

function* REGISTER_SPATIAL_ASSET_SAGA() {
  const astral = new AstralClient();

  const spatialAssetsState = yield select(getSpatialAssetsState);

  const { spatialAsset } = spatialAssetsState;

  const geodidid = yield call(
    astral.createGeoDID,
    spatialAsset,
    '0xcF56B3442eBC30EDe0838334419b5a80eEa45da8',
  );

  console.log(geodidid);
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOAD_COGS, LOAD_COGS_SAGA),
    takeEvery(actions.REGISTER_SPATIAL_ASSET, REGISTER_SPATIAL_ASSET_SAGA),
  ]);
}
