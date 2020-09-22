import React, { useState, useEffect, useRef } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import useLocation from 'core/hooks/useLocation';

const FullMap = () => {
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
    </div>
  );
};

export default FullMap;
