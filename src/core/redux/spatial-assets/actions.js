export const actions = {
  SET_SPATIAL_ASSET: 'spatial-assets/SET_SPATIAL_ASSET',
  SET_LOADED_COGS: 'spatial-assets/SET_LOADED_COGS',
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

export const setLoadedCogs = (loadedCogs) => {
  return {
    type: actions.SET_LOADED_COGS,
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
