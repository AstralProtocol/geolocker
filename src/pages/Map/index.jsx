import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import useLocation from 'core/hooks/useLocation';
import { connect } from 'react-redux';

const FullMap = (props) => {
  const location = useLocation();

  const { mapDimensions } = props;

  console.log(mapDimensions);
  const [viewport, setViewport] = useState({
    width: mapDimensions.width,
    height: mapDimensions.height,
    latitude: 31.9742044,
    longitude: -49.25875,
    zoom: 2,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        ...viewport,
        width: mapDimensions.width,
        height: mapDimensions.height,
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

  return (
    <ReactMapGL
      mapStyle="mapbox://styles/j-mars/ckfcepjb09bdg1aqw1novj44h"
      mapboxApiAccessToken={process.env.REACT_APP_MapboxAccessToken}
      // eslint-disable-next-line
      {...viewport}
      onViewportChange={(vp) => setViewport(vp)}
    >
      {location ? (
        <Marker
          latitude={location.latitude}
          longitude={location.longitude}
          offsetLeft={-20}
          offsetTop={-10}
        >
          <span style={{ fontSize: `${viewport.zoom * 0.5}rem` }}>BOOM</span>
        </Marker>
      ) : null}
    </ReactMapGL>
  );
};

const mapStateToProps = (state) => ({
  mapDimensions: state.settings.mapDimensions,
});

export default connect(mapStateToProps, null)(FullMap);
