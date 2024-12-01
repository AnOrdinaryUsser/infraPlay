import React from "react";
import { Link } from "react-router-dom";
import { CButton, CCol, CContainer, CRow } from "@coreui/react";

/**
 * @description View for SentEmail
 * In this view the user is informed that the mail has been sent.
 */
const SentEmail = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <h1 className="text-center mb-3">
              Usuario verificado con exito!
            </h1>
            <p className="text-center mb-3">
              Muchas gracias por formar parte de la familia de InfraPlay
            </p>
            <div className="d-grid gap-2 d-md-flex justify-content-center">
              <Link to="/login">
                <CButton color="secondary" aria-pressed="true">
                  Volver al inicio
                </CButton>
              </Link>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default SentEmail;
