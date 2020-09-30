import React, { useState, useEffect, useRef } from 'react';
import ReactMapGL, {
  Marker,
  Source,
  Layer,
  FlyToInterpolator,
  WebMercatorViewport,
} from 'react-map-gl';
import { connect } from 'react-redux';
import useLocation from 'core/hooks/useLocation';
import Emoji from 'components/Emoji';
import { easeCubic } from 'd3-ease';
import axios from 'axios';

const regex = /(?:\.([^.]+))?$/;

const Map = (props) => {
  const { collapsed, initialMapLoad, siderWidth, spatialAsset, spatialAssetLoaded } = props;
  const location = useLocation();
  const parentRef = useRef(null);
  const [viewport, setViewport] = useState({
    latitude: 31.9742044,
    longitude: -49.25875,
    zoom: 2,
  });
  const [hoveredState, setHoveredState] = useState({ hoveredFeature: null });
  const [loadedTileJson, setLoadedTileJson] = useState(null);

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
    if (location) {
      setViewport((vp) => ({
        ...vp,
        ...location,
        zoom: 8,
      }));
    }
  }, [location, setViewport]);

  const onStacDataLoad = (sAsset) => {
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
  };

  useEffect(() => {
    async function loadSpatialAsset() {
      if (spatialAssetLoaded && spatialAsset) {
        onStacDataLoad(spatialAsset);

        const cogsUrl = Object.values(spatialAsset.assets).reduce((newData, asset) => {
          if (regex.exec(asset.href)[1] === 'tif') {
            newData.push(asset.href);
          }
          return newData;
        }, []);

        const response = await axios.get(`http://tiles.rdnt.io/tiles?url=${cogsUrl && cogsUrl[0]}`);

        if (response.status === 200) {
          setLoadedTileJson(response.data);
        } else {
          setLoadedTileJson(null);
        }
      }
    }
    loadSpatialAsset();
  }, [spatialAsset]);

  const dataLayer = {
    id: 'dataLayer',
    source: 'geojson',
    type: 'fill',
    paint: { 'fill-color': '#228b22', 'fill-opacity': 0.4 },
  };

  const onHover = (event) => {
    const {
      features,
      srcEvent: { offsetX, offsetY },
    } = event;
    const hoveredFeature = features && features.find((f) => f.layer.id === 'data');

    setHoveredState({ hoveredFeature, x: offsetX, y: offsetY });
  };

  console.log(loadedTileJson);
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
        onHover={onHover}
      >
        <Source id="geojson" type="geojson" data={spatialAssetLoaded && spatialAsset.geometry}>
          <Layer
            // eslint-disable-next-line
            {...dataLayer}
          />
        </Source>
        {loadedTileJson && (
          <Source id="tiffjson" type="raster" tiles={loadedTileJson.tiles}>
            <Layer id="tiffjson" type="raster" />
          </Source>
        )}

        {hoveredState.hoveredFeature && (
          <div
            className="tooltip"
            style={{
              left: hoveredState.x,
              top: hoveredState.y,
            }}
          >
            <div>State: {hoveredState.hoveredFeature.properties.name}</div>
            <div>#Events: {hoveredState.hoveredFeature.properties.value}</div>
          </div>
        )}

        {location ? (
          <Marker
            latitude={location.latitude}
            longitude={location.longitude}
            offsetLeft={-20}
            offsetTop={-10}
          >
            <span style={{ fontSize: `${viewport.zoom * 0.5}rem` }}>
              <Emoji symbol="🚀" />
            </span>
          </Marker>
        ) : null}
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
});

export default connect(mapStateToProps, null)(Map);
