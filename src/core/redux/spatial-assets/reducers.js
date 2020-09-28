import { actions } from './actions';

const initialState = {
  spatialAsset: null,
  spatialAssetLoaded: false,
};

export default function spatialAssetsReducer(state = initialState, action) {
  let reduced;
  switch (action.type) {
    case actions.SET_SPATIAL_ASSET:
      reduced = {
        ...state,
        ...action.payload,
      };
      break;

    default:
      reduced = state;
  }
  return reduced;
}
