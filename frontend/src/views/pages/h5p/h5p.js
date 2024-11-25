import React from 'react';
import { useParams } from 'react-router-dom';

/**
 * @description View for embed pages
 * This view is used to create an embedded iframe to load your game from a URL or h5p ID.
 */
const EmbedPage = () => {
  const { gameId } = useParams(); // Obtener el ID del juego de la URL

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
        overflow: 'hidden', // Evita el scroll
      }}
    >
      <iframe
        src={`https://infraplay.h5p.com/content/${gameId}/embed`}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        title="H5P Content"
        style={{
          display: 'block',
          border: 'none', // Asegura que no haya bordes del iframe
          width: '100%',  // Ajusta al ancho completo del contenedor
          height: '100%', // Ajusta al alto completo del contenedor
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
