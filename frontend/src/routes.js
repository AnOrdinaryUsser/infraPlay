import React from 'react'

const Profile = React.lazy(() => import('./views/dashboard/Profile'))
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const UsersDashboard = React.lazy(() => import('./views/dashboard/UsersDashboard'))
const Sections = React.lazy(() => import('./views/sections/Sections'))
const Games = React.lazy(() => import('./views/games/Games'))


const routes = [
  { path: '/', exact: true, name: 'Login' },
  { path: '/profile', name: 'Profile', element: Profile },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/usersDashboard', name: 'usersDashboard', element: UsersDashboard },
  { path: '/sections', name: 'sections', element: Sections },
  { path: '/games', name: 'games', element: Games },
]

export default routes
