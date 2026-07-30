import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/Layout/AppShell'
import Landing from './pages/Landing'
import RoleSelect from './pages/RoleSelect'
import Home from './pages/Home'
import SearchResults from './pages/SearchResults'
import ProfessorProfile from './pages/ProfessorProfile'
import ProfessorDashboard from './pages/ProfessorDashboard'
import CampusMap from './pages/CampusMap'
import ExamCenterFinder from './pages/ExamCenterFinder'
import ExamControllerDashboard from './pages/ExamControllerDashboard'
import Emergency from './pages/Emergency'
import Settings from './pages/Settings'
import Events from './pages/Events'
import NotFound from './pages/NotFound'
import { useApp } from './context/AppContext'

function RequireRole({ children }) {
  const { role } = useApp()
  if (!role) return <Navigate to="/select-role" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/select-role" element={<RoleSelect />} />

      <Route
        element={
          <RequireRole>
            <AppShell />
          </RequireRole>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/professor/:id" element={<ProfessorProfile />} />
        <Route path="/professor-dashboard" element={<ProfessorDashboard />} />
        <Route path="/map" element={<CampusMap />} />
        <Route path="/exam-center" element={<ExamCenterFinder />} />
        <Route path="/exam-controller" element={<ExamControllerDashboard />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/events" element={<Events />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
