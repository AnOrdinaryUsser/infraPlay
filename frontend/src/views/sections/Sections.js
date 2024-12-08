import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import {
  CButton,
  CFormInput,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CContainer,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CForm,
  CInputGroup,
  CInputGroupText,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilTrash, cilPencil, cilViewStream, cilViewColumn } from "@coreui/icons";
import { refreshToken, addUser } from "../../services/UserService.js";
import { getSections, addSection, deleteSection, modifySection } from "../../services/SectionService.js";

const IP_SERVER = process.env.REACT_APP_IP_SERVER;
const PORT_BACKEND = process.env.REACT_APP_PORT_BACKEND;

/**
 * @description View for Sections
 * This view shows you a list of sections that are associated to a user. In addition, you can add, delete and modify sections.
 */
const Sections = () => {
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [users, setUsers] = useState([]);
  const [validated, setValidated] = useState(false);
  const [visible, setVisible] = useState(false);
  const [activeKey, setActiveKey] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const [grid, setGrid] = useState({ rows: 0, cols: 0 });
  const [sections, setSections] = useState([]);
  const [userName, setUserName] = useState("");
  const [sectionName, setSectionName] = useState(0);
  const [sectionRows, setSectionRows] = useState(0);
  const [sectionCols, setSectionCols] = useState(0);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [editSectionName, setEditSectionName] = useState("");
  const [editSectionRows, setEditSectionRows] = useState(0);
  const [editSectionCols, setEditSectionCols] = useState(0);


  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [institute, setInstitute] = useState("");

  useEffect(() => {
    // Refresh token and get user info
    const fetchUserData = async () => {
      try {
        await refreshToken(setToken, setExpire, setName, setSurname, setInstitute, setUserName, setEmail);
      } catch (error) {
        console.error("Error refreshing token", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userName) {
      getSections(userName, setSections).catch(error => console.error("Error fetching sections", error));
    }
  }, [userName]);

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get(`http://${IP_SERVER}:${PORT_BACKEND}/token`);
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setExpire(decoded.exp);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // Crear el objeto con los datos
        const sectionData = { sectionName, sectionRows, sectionCols, userName };
        console.log(sectionData);
        
        // Llamada a la función de agregar sección (ahora esperamos la respuesta del servicio)
        const response = await addSection(sectionData);

        // Verificamos la respuesta de la API
        if (response && response.msg) {
            console.log("Sección creada con éxito ✔️");
            console.log(response.msg);
            alert(response.msg); // Muestra el mensaje de éxito
            if (userName) {
              getSections(userName, setSections).catch(error => console.error("Error fetching sections", error));
            }
            setVisible(false);
        } else if (response && response.error) {
            // Si la respuesta tiene un error, mostramos ese mensaje
            alert(response.error);  // Muestra el mensaje de error
        } else {
            // Si no hay respuesta válida
            alert("Error desconocido al crear la sección.");
        }

    } catch (error) {
        console.error("Error al crear la sección", error);
        alert("Error al crear la sección. Por favor, intente nuevamente.");
    }
};

const handleDelete = async (id) => {
  const confirmDelete = window.confirm("🚨 ¿Estás seguro de que deseas eliminar esta sección?");
  if (confirmDelete) {
    try {
      await deleteSection(id);  // Llamamos a la función de servicio para eliminar la sección
      if (userName) {
        getSections(userName, setSections).catch(error => console.error("Error fetching sections", error));
      }
      setSections(sections.filter((section) => section.id !== id));  // Actualizamos el estado local para reflejar los cambios
      alert("Sección eliminada con éxito ✔️");
    } catch (error) {
      console.error("Error al eliminar la sección:", error);
      alert("Error al eliminar la sección");
    }
  }
};

const handleEdit = (section) => {
  setSelectedSection(section);
  setEditSectionName(section.name);
  setEditSectionRows(section.rows);
  setEditSectionCols(section.cols);
  setEditModalVisible(true);
};

const handleModifySection = async (e) => {
  e.preventDefault();
  const updatedSection = {
    ...selectedSection,
    name: editSectionName,
    rows: editSectionRows,
    cols: editSectionCols,
  };
  try {
    await modifySection(updatedSection, setValidated);
    setEditModalVisible(false);
    alert("Sección modificada con éxito");
  } catch (error) {
    console.error("Error al modificar la sección:", error);
    alert("Error al modificar la sección");
  }
};

  return (
    <>
      <h1 className="mb-4">Secciones </h1>
      <CContainer fluid>
        <CTable className="mb-4" >
          <CTableHead color="secondary">
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
              <CTableHeaderCell scope="col">Filas</CTableHeaderCell>
              <CTableHeaderCell scope="col">Columnas</CTableHeaderCell>
              <CTableHeaderCell scope="col"></CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {sections.map((section, index) => {
              return (
                <CTableRow key={index}>
                  <CTableDataCell>{index}</CTableDataCell>
                  <CTableDataCell>{section.name}</CTableDataCell>
                  <CTableDataCell>{section.rows}</CTableDataCell>
                  <CTableDataCell>{section.cols}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      id={section.id}
                      style={{
                        backgroundColor: "#3a8cbe",
                        borderColor: "#3a8cbe",
                        marginRight: "5px",
                      }}
                      size="sm"
                      onClick={() => handleEdit(section)}
                    >
                      <CIcon icon={cilPencil}></CIcon>
                    </CButton>
                    <CButton
                      style={{
                        backgroundColor: "#e8463a",
                        borderColor: "#e8463a",
                      }}
                      size="sm"
                    >
                      <CIcon size="xs" icon={cilTrash}  onClick={() => handleDelete(section.id)}/>
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              );
            })}
          </CTableBody>
        </CTable>
        <CButton
          className="mb-4 d-grid"
          color="secondary"
          style={{ color: "white" }}
          onClick={() => setVisible(true)}
        >
          Añadir sección
        </CButton>
      </CContainer>
      <CModal
        alignment="center"
        visible={visible}
        onClose={() => setVisible(false)}
      >
        <CModalHeader onClose={() => setVisible(false)}>
          <CModalTitle>Añadir sección</CModalTitle>
        </CModalHeader>
        <CModalBody>
        <CForm
          validated={validated}
          onSubmit={(e) => handleSubmit(e)} // Usar únicamente onSubmit
        >
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilPencil} />
            </CInputGroupText>
            <CFormInput
              placeholder="Nombre"
              id="name"
              onChange={(e) => setSectionName(e.target.value)}
              required
            />
          </CInputGroup>
          <CInputGroup className="mb-3">
            <CInputGroupText><CIcon icon={cilViewStream} /></CInputGroupText>
            <CFormInput
              id="rows"
              type="number"
              placeholder="Filas"
              onChange={(e) => setSectionRows(Number(e.target.value))}
              required
            />
          </CInputGroup>
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilViewColumn} />
            </CInputGroupText>
            <CFormInput
              id="cols"
              type="number"
              placeholder="Columnas"
              onChange={(e) => setSectionCols(Number(e.target.value))}
              required
            />
          </CInputGroup>
          <div className="d-grid">
            <CButton type="submit" color="success" aria-pressed="true">
              Crear sección
            </CButton>
          </div>
        </CForm>
        </CModalBody>
      </CModal>
      <CModal
  alignment="center"
  visible={editModalVisible}
  onClose={() => setEditModalVisible(false)}
>
  <CModalHeader onClose={() => setEditModalVisible(false)}>
    <CModalTitle>Modificar sección</CModalTitle>
  </CModalHeader>
  <CModalBody>
    <CForm
      validated={validated}
      onSubmit={(e) => handleModifySection(e)}
    >
      <CInputGroup className="mb-3">
        <CInputGroupText>
          <CIcon icon={cilPencil} />
        </CInputGroupText>
        <CFormInput
          placeholder="Nombre"
          value={editSectionName}
          onChange={(e) => setEditSectionName(e.target.value)}
          required
        />
      </CInputGroup>
      <CInputGroup className="mb-3">
        <CInputGroupText><CIcon icon={cilViewStream} /></CInputGroupText>
        <CFormInput
          placeholder="Filas"
          type="number"
          value={editSectionRows}
          onChange={(e) => setEditSectionRows(e.target.value)}
          required
        />
      </CInputGroup>
      <CInputGroup className="mb-3">
        <CInputGroupText>
          <CIcon icon={cilViewColumn} />
        </CInputGroupText>
        <CFormInput
          placeholder="Columnas"
          type="number"
          value={editSectionCols}
          onChange={(e) => setEditSectionCols(e.target.value)}
          required
        />
      </CInputGroup>
      <div className="d-grid">
        <CButton type="submit" color="success" aria-pressed="true">
          Guardar cambios
        </CButton>
      </div>
    </CForm>
  </CModalBody>
      </CModal>
    </>
  );
};

export default Sections;
