import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilUser,
  cilSpreadsheet,
  cilImage,
  cilGrid,
  cilGamepad,
  cilChart,
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'


const _nav = [
  {
    component: CNavTitle,
    name: "Pizarra de juegos",
  },
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilGrid} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: "Datos",
  },
  {
    component: CNavItem,
    name: 'Secciones',
    to: '/sections',
    icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Juegos',
    to: '/games',
    icon: <CIcon icon={cilGamepad} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: "Estadísticas",
  },
  {
    component: CNavItem,
    name: 'Datos',
    to: '/devices',
    icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: "Perfil",
  },
  {
    component: CNavItem,
    name: 'Mis datos',
    to: '/profile',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
]

export default _nav
