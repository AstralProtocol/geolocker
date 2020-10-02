import { actions } from './actions';

const initialState = {
  spatialAsset: null,
  spatialAssetLoaded: false,
  loadedCogs: [],
  selectedCog: null,
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

    case actions.SET_LOADED_COGS:
      reduced = {
        ...state,
        ...action.payload,
      };
      break;

    case actions.SET_SELECTED_COG:
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
