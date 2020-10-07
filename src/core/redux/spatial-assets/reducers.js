import { actions } from './actions';

const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';

const initialState = {
  fileList: [],
  spatialAsset: null,
  spatialAssetLoaded: false,
  loadedCogs: null,
  loadedTiffJson: [],
  selectedCog: null,
};

export default function spatialAssetsReducer(state = initialState, action) {
  let reduced;
  switch (action.type) {
    case actions.SET_FILELIST:
      reduced = {
        ...state,
        ...action.payload,
      };
      break;

    case actions.SET_SPATIAL_ASSET:
      reduced = {
        ...state,
        ...action.payload,
      };
      break;

    case actions.COGS_LOADED:
      reduced = {
        ...state,
        ...action.payload,
      };
      break;

    case actions.UNLOAD_COGS:
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

    case LOCATION_CHANGE:
      reduced = {
        ...initialState,
      };
      break;

    default:
      reduced = state;
  }
  return reduced;
}
