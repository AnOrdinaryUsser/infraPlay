import React from 'react';
import { useParams } from 'react-router-dom';

/**
 * @description View for embed pages
 * This view is used to create an embedded iframe to load your game from a URL or h5p ID.
 */
const EmbedPage = () => {
  const { gameId } = useParams();  // Obtener el ID del juego de la URL

  return (
    <div 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100vw', 
        height: '100vh', 
        margin: 0, 
        padding: 0,
        overflow: 'hidden',  // Evita el scroll en caso de que el contenido sea mayor que la ventana
      }}
    >
      <iframe
        src={`https://h5p.org/h5p/embed/${gameId}`}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        title="H5P Content"
        style={{ 
          display: 'block',
          maxWidth: '100%',
          maxHeight: '100%',
        }} 
      />
      <script
        src="https://h5p.org/sites/all/modules/h5p/library/js/h5p-resizer.js"
        charset="UTF-8"
      ></script>
    </div>
  );
};

export default EmbedPage;
