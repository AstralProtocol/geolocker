export const actions = {
  SET_FILELIST: 'spatial-assets/SET_FILELIST',
  SET_SPATIAL_ASSET: 'spatial-assets/SET_SPATIAL_ASSET',
  LOAD_COGS: 'spatial-assets/LOAD_COGS',
  UNLOAD_COGS: 'spatial-assets/UNLOAD_COGS',
  COGS_LOADED: 'spatial-assets/COGS-LOADED',
  SET_SELECTED_COG: 'spatial-assets/SET_SELECTED_COG',
  REGISTER_SPATIAL_ASSET: 'spatial-assets/REGISTER_SPATIAL_ASSET',
};

export const setFileList = (fileList) => {
  return {
    type: actions.SET_FILELIST,
    payload: {
      fileList,
    },
  };
};

export const setSpatialAsset = () => {
  return {
    type: actions.SET_SPATIAL_ASSET,
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

export const unloadCogs = () => {
  return {
    type: actions.UNLOAD_COGS,
    payload: {
      loadedCogs: null,
      loadedTiffJson: [],
      selectedCog: null,
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

export const registerSpatialAsset = (stacItem, address) => {
  return {
    type: actions.REGISTER_SPATIAL_ASSET,
    payload: {
      stacItem,
      address,
    },
  };
};
