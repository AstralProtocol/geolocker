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

const Map = (props) => {
  const { collapsed, initialMapLoad, siderWidth, spatialAsset, spatialAssetLoaded } = props;

  const location = useLocation();

  const parentRef = useRef(null);

  const [viewport, setViewport] = useState({
    latitude: 31.9742044,
    longitude: -49.25875,
    zoom: 2,
  });

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
    if (spatialAssetLoaded && spatialAsset) {
      onStacDataLoad(spatialAsset);
    }
  }, [spatialAsset]);

  const dataLayer = {
    id: 'dataLayer',
    source: 'stacItem',
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
        <Source id="stacItem" type="geojson" data={spatialAssetLoaded && spatialAsset.geometry} />
        <Layer
          // eslint-disable-next-line
          {...dataLayer}
        />
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
