import React from 'react';

/**
 * @component Map
 * @description Component for show a map from a url.
 */
const Map = () => {
  return (
    <div>     
      <iframe
        title="Mapa"
        src="http://localhost:8000/"
        style={{ width: '100%', height: '85vh', border: 'none' }}
        allowFullScreen
      />
    </div>
  );
};

export default Map;
