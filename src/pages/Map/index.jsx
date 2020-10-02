import React, { useState, useEffect, useRef } from 'react';
import ReactMapGL, { Source, Layer, FlyToInterpolator, WebMercatorViewport } from 'react-map-gl';
import { connect } from 'react-redux';
import { easeCubic } from 'd3-ease';
import axios from 'axios';
import { loadCogs, setSelectedCog } from 'core/redux/spatial-assets/actions';

const regex = /(?:\.([^.]+))?$/;

const Map = (props) => {
  const {
    collapsed,
    initialMapLoad,
    siderWidth,
    spatialAsset,
    spatialAssetLoaded,
    dispatchLoadCogs,
    loadedCogs,
    selectedCog,
    dispatchSetSelectedCog,
  } = props;
  const parentRef = useRef(null);
  const [viewport, setViewport] = useState({
    latitude: 30,
    longitude: 0,
    zoom: 2,
  });
  const [loadedTileJson, setLoadedTileJson] = useState(null);

  const onStacDataLoad = (sAsset = null) => {
    if (sAsset) {
      const { longitude, latitude, zoom } = new WebMercatorViewport(viewport).fitBounds(
        [
          [sAsset.bbox[0], sAsset.bbox[1]],
          [sAsset.bbox[2], sAsset.bbox[3]],
        ],
        {
          padding: 20,
          offset: [0, -100],
        },
      );

      setViewport({
        ...viewport,
        longitude,
        latitude,
        zoom,
        transitionDuration: 2000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: easeCubic,
      });
    } else {
      setViewport({
        ...viewport,
        latitude: 30,
        longitude: 0,
        zoom: 2,
        transitionDuration: 2000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: easeCubic,
      });
    }
  };

  useEffect(() => {
    if (parentRef.current) {
      setViewport({
        ...viewport,
        width: parentRef.current.offsetWidth,
        height: parentRef.current.offsetHeight,
      });
    }
  }, [parentRef]);

  useEffect(() => {
    if (!initialMapLoad && collapsed) {
      setViewport({
        ...viewport,
        width: parentRef.current.offsetWidth + siderWidth - 80,
        height: parentRef.current.offsetHeight,
      });
    }
  }, [initialMapLoad, collapsed]);

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        ...viewport,
        width: parentRef.current.offsetWidth,
        height: parentRef.current.offsetHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  useEffect(() => {
    console.log(spatialAssetLoaded);
    console.log(spatialAsset);
    console.log(initialMapLoad);
    if (spatialAssetLoaded && spatialAsset) {
      const cogs = Object.values(spatialAsset.assets).reduce((newData, asset) => {
        if (regex.exec(asset.href)[1] === 'tif') {
          newData.push(asset.href);
        }
        return newData;
      }, []);

      if (cogs) {
        dispatchLoadCogs(cogs);
        dispatchSetSelectedCog(cogs[0]);
      }
    } else if (!initialMapLoad) {
      onStacDataLoad(null);
    }
  }, [spatialAsset, initialMapLoad, dispatchLoadCogs]);

  useEffect(() => {
    async function loadTileJson() {
      if (loadedCogs && selectedCog) {
        const response = await axios.get(`http://tiles.rdnt.io/tiles?url=${selectedCog}`);
        if (response.status === 200) {
          setLoadedTileJson(response.data);
          onStacDataLoad(spatialAsset);
        } else {
          setLoadedTileJson(null);
        }
      }
    }
    loadTileJson();
  }, [loadedCogs, selectedCog]);

  const dataLayer = {
    id: 'dataLayer',
    source: 'geojson',
    type: 'fill',
    paint: { 'fill-color': '#228b22', 'fill-opacity': 0.4 },
  };

  return (
    <div
      style={{
        height: '100%',
      }}
      ref={parentRef}
    >
      <ReactMapGL
        mapStyle="mapbox://styles/j-mars/ckfcepjb09bdg1aqw1novj44h"
        mapboxApiAccessToken={process.env.REACT_APP_MapboxAccessToken}
        // eslint-disable-next-line
        {...viewport}
        onViewportChange={(vp) => setViewport(vp)}
      >
        {spatialAssetLoaded && (
          <>
            <Source id="geojson" type="geojson" data={spatialAsset.geometry}>
              <Layer
                // eslint-disable-next-line
                {...dataLayer}
              />
            </Source>
            <Source id="tiffjson" type="raster" tiles={loadedTileJson && loadedTileJson.tiles}>
              <Layer id="tiffjson" type="raster" />
            </Source>
          </>
        )}
      </ReactMapGL>
    </div>
  );
};

const mapStateToProps = (state) => ({
  collapsed: state.settings.collapsed,
  initialMapLoad: state.settings.initialMapLoad,
  siderWidth: state.settings.siderWidth,
  spatialAsset: state.spatialAssets.spatialAsset,
  spatialAssetLoaded: state.spatialAssets.spatialAssetLoaded,
  loadedCogs: state.spatialAssets.loadedCogs,
  selectedCog: state.spatialAssets.selectedCog,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchLoadCogs: (loadedCogs) => dispatch(loadCogs(loadedCogs)),
  dispatchSetSelectedCog: (selectedCog) => dispatch(setSelectedCog(selectedCog)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
