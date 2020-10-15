import { channel } from 'redux-saga';
import { all, takeEvery, put, call, select, take, fork } from 'redux-saga/effects';
import axios from 'axios';
import AstralClient from '@astraldao/astral-protocol-core';
import {
  actions as commitActions,
  commitSendSuccess,
  commitMinedSuccess,
  commitError,
} from 'core/redux/contracts/actions';
import { actions } from './actions';

const getSpatialAssetsState = (state) => state.spatialAssets;
const getContractsState = (state) => state.contracts;
const getLoginState = (state) => state.login;

const geoDIDRegistrationChannel = channel();

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

/**
 * @dev Event channel to control the smart contract update events
 */
function* handleGeoDIDRegistration() {
  while (true) {
    const eventAction = yield take(geoDIDRegistrationChannel);
    switch (eventAction.type) {
      case commitActions.COMMIT_SEND_SUCCESS: {
        yield put(commitSendSuccess(eventAction.tx));
        break;
      }

      case commitActions.COMMIT_MINED_SUCCESS: {
        yield put(commitMinedSuccess(eventAction.receipt));

        yield put({
          type: actions.SPATIAL_ASSET_REGISTERED,
          registeringSpatialAsset: false,
          spatialAssetRegistered: true,
        });

        yield put({
          type: actions.STOP_CHANNEL_FORK,
        });

        break;
      }
      case commitActions.COMMIT_ERROR: {
        yield put(commitError(eventAction.error));
        break;
      }

      case actions.STOP_CHANNEL_FORK: {
        return;
      }

      default: {
        break;
      }
    }
  }
}

function* REGISTER_SPATIAL_ASSET_SAGA() {
  yield put({
    type: actions.REGISTERING_SPATIAL_ASSET,
    payload: {
      registeringSpatialAsset: true,
      spatialAssetRegistered: false,
    },
  });

  const { SpatialAssetRegistrar } = yield select(getContractsState);
  const { selectedAccount } = yield select(getLoginState);

  const astral = new AstralClient();
  console.log(astral);

  const { spatialAsset } = yield select(getSpatialAssetsState);
  console.log(spatialAsset);

  /*
  const geodidid = yield call(
    astral.createGeoDID,
    spatialAsset,
    '0xcF56B3442eBC30EDe0838334419b5a80eEa45da8',
  );


  console.log(geodidid);
  */

  // test hash and cid, change these
  const hash = '0x5519c53ea99f0d33f6a57941ccb197dd2bafef51a5b1786972721b2f2ea66e11';

  const cid = 'ipfs:abcdefghi123456';

  // fork to handle channel
  yield fork(handleGeoDIDRegistration);

  const gasEstimate = yield call(
    SpatialAssetRegistrar.instance.methods.register(hash, cid).estimateGas,
    {
      from: selectedAccount,
    },
  );

  try {
    SpatialAssetRegistrar.instance.methods
      .register(hash, cid)
      .send({
        from: selectedAccount,
        gas: gasEstimate,
      })
      .once('transactionHash', (tx) => {
        geoDIDRegistrationChannel.put({
          type: commitActions.COMMIT_SEND_SUCCESS,
          tx,
        });
      })
      .once('receipt', (receipt) => {
        geoDIDRegistrationChannel.put({
          type: commitActions.COMMIT_MINED_SUCCESS,
          receipt,
        });
      })
      .on('error', (error) => {
        geoDIDRegistrationChannel.put({
          type: commitActions.COMMIT_ERROR,
          error,
        });
      });
  } catch (err) {
    const errMsg = err.toString();
    const shortErr = errMsg.substring(0, errMsg.indexOf('.') + 1);
    put(commitError(shortErr));
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOAD_COGS, LOAD_COGS_SAGA),
    takeEvery(actions.REGISTER_SPATIAL_ASSET, REGISTER_SPATIAL_ASSET_SAGA),
  ]);
}
