import React, { useState, useEffect } from 'react';
import { CContainer, CRow, CCol, CFormInput, CButton, CImage, CCard, CCardBody, CCardHeader } from '@coreui/react';
import { getSensorValues, saveSensorValues } from '../../services/SensorService';
import board from '../../assets/images/board.png';

const SensorConfigurator = () => {
  const [dimensions, setDimensions] = useState({
    xmin: 0,
    xmax: 0,
    ymin: 0,
    ymax: 0,
  });

  useEffect(() => {
    // Obtener los valores del sensor al cargar la página
    getSensorValues()
      .then((data) => {
        setDimensions(data);  // Rellenamos los valores al cargar
      })
      .catch((error) => {
        console.error('Error fetching sensor values:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDimensions({ ...dimensions, [name]: parseFloat(value) || 0 });
  };

  const handleSave = () => {
    // Guardar los valores del sensor
    saveSensorValues(dimensions)
      .then((response) => {
        console.log('Sensor values saved:', response);
        alert('Valores del sensor guardados exitosamente');
      })
      .catch((error) => {
        console.error('Error saving sensor values:', error);
        alert('Error al guardar los valores');
      });
  };

  return (
    <>
    <h1 className="mb-4">Configuración del sensor</h1>
    <CContainer>
      <CRow>
        {/* Zona de dibujo */}
        <CCol md={8} className="d-flex justify-content-center align-items-center">
        <CContainer
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '800px',
              padding: 0, // Elimina el padding por defecto
            }}
          >
            {/* Imagen responsiva */}
            <CImage
              src={board}
              alt="Fondo"
              fluid // Esto asegura que la imagen sea responsiva
              style={{ display: 'block', width: '100%', height: 'auto' }}
            />
            {/* Rectángulo */}
             <div
              style={{
                position: 'absolute',
                left: `calc(50% - ${((dimensions.xmax - dimensions.xmin) / 2)*160}px)`,
                bottom: `${(-dimensions.ymax)*160}px`,
                width: `${Math.abs(dimensions.xmax - dimensions.xmin)*160}px`,
                height: `${dimensions.ymin*160}px`,
                backgroundColor: 'rgba(255, 0, 0, 0.3)', // Azul semitransparente
                border: '2px solid red',
              }}
            ></div>
          </CContainer>
        </CCol>

        {/* Zona de configuración */}
        <CCol md={4}>
          <div>
            <label>Xmin (Distancia desde el centro hacia la izquierda):</label>
            <CFormInput
              type="number"
              step="0.01" // Permitir decimales
              name="xmin"
              value={dimensions.xmin}
              onChange={handleChange}
              placeholder="Introduce Xmin (negativos permitidos)"
            />
          </div>
          <div>
            <label>Xmax (Distancia desde el centro hacia la derecha):</label>
            <CFormInput
              type="number"
              step="0.01" // Permitir decimales
              name="xmax"
              value={dimensions.xmax}
              onChange={handleChange}
              placeholder="Introduce Xmax (negativos permitidos)"
            />
          </div>
          <div>
            <label>Ymin (Altura del rectángulo):</label>
            <CFormInput
              type="number"
              step="0.01" // Permitir decimales
              name="ymin"
              value={dimensions.ymin}
              onChange={handleChange}
              placeholder="Introduce Ymin"
            />
          </div>
          <div>
            <label>Ymax (Distancia desde el suelo):</label>
            <CFormInput
              type="number"
              step="0.01" // Permitir decimales
              name="ymax"
              value={dimensions.ymax}
              onChange={handleChange}
              placeholder="Introduce Ymax (negativos permitidos)"
            />
          </div>
          <CButton color="success" className="mt-3" onClick={handleSave}>
            Guardar
          </CButton>
        </CCol>
      </CRow>
       {/* CCard de ayuda */}
       <CRow className="mt-4">
        <CCol>
          <CCard>
            <CCardHeader>
              <strong>Instrucciones de Configuración</strong>
            </CCardHeader>
            <CCardBody>
              <p><strong>Para configurar el sensor infrarrojo:</strong></p>
              <ol>
                <li>
                  <strong>Ymax:</strong> Mide la distancia desde el infrarrojo hasta el borde inferior de la proyección (esto será el valor de Ymax, en negativo).
                </li>
                <li>
                  <strong>Ymin:</strong> Mide el alto de la pantalla proyectada. Este será el valor de Ymin.
                </li>
                <li>
                  <strong>Xmin y Xmax:</strong> Mide el ancho de la pantalla proyectada. Divide esta medida entre dos para obtener el valor de Xmax. El valor de Xmin será el negativo de Xmax.
                </li>
              </ol>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
    </>
  );
};

export default SensorConfigurator;