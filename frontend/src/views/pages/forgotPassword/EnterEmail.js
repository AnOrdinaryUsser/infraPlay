import React, { useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CRow,
} from "@coreui/react";
import image from "./../../../assets/images/background.jpg";
import { forgotPassword } from "../../../services/MailService.js"

/**
 * @description View for EnterMail
 * In this view, the user enters his or her e-mail address in order to reset his or her password.
 */
const EnterMail = () => {
  const [validated, setValidated] = useState(false);

  return (
    <div
      style={{
        backgroundImage: `url(${image})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      className="min-vh-100 d-flex flex-row align-items-center"
    >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm validated={validated} onSubmit={(e) => forgotPassword(e, setValidated)}>
                  <h4 className="text-center mb-3">Introduce tu correo</h4>
                  <CInputGroup className="align-content-center mb-3">
                    <CFormInput
                      placeholder="Email"
                      id="email"
                      type="email"
                      required
                    />
                  </CInputGroup>
                  <div className="d-grid gap-2 d-md-flex justify-content-end">
                    <CButton type="submit" color="success" aria-pressed="true">
                      Enviar
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default EnterMail;
