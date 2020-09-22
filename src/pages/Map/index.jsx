import React, { useState, useEffect, useRef } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import { connect } from 'react-redux';
import useLocation from 'core/hooks/useLocation';
import Emoji from 'components/Emoji';

const Map = (props) => {
  const { collapsed, initialMapLoad, siderWidth } = props;

  const location = useLocation();

  const parentRef = useRef(null);

  const [viewport, setViewport] = useState({
    latitude: 31.9742044,
    longitude: -49.25875,
    zoom: 2,
  });

  useEffect(() => {
    if (parentRef.current) {
      console.log(0);
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
      console.log(2);
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
});

export default connect(mapStateToProps, null)(Map);
