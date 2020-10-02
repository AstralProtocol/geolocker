export const actions = {
  SET_SPATIAL_ASSET: 'spatial-assets/SET_SPATIAL_ASSET',
  LOAD_COGS: 'spatial-assets/LOAD_COGS',
  COGS_LOADED: 'spatial-assets/COGS-LOADED',
  SET_SELECTED_COG: 'spatial-assets/SET_SELECTED_COG',
};

export const setSpatialAsset = (spatialAsset, spatialAssetLoaded) => {
  return {
    type: actions.SET_SPATIAL_ASSET,
    payload: {
      spatialAsset,
      spatialAssetLoaded,
    },
  };
};

export const loadCogs = (loadedCogs) => {
  return {
    type: actions.LOAD_COGS,
    payload: {
      loadedCogs,
    },
  };
};

export const setSelectedCog = (selectedCog) => {
  return {
    type: actions.SET_SELECTED_COG,
    payload: {
      selectedCog,
    },
  };
};
