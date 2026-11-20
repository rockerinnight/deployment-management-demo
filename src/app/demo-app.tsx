import { useState } from 'react'
import { App, Alert, Button, ConfigProvider, Result, Spin } from 'antd'
import enUS from 'antd/locale/en_US'
import { useQueryClient } from '@tanstack/react-query'
import {
  NavLink,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom'
import { DashboardView } from '../features/dashboard/dashboard-view'
import { resetDemo } from '../features/deployment/api'
import { DeploymentView } from '../features/deployment/deployment-view'
import { can, ROLES } from '../shared/policy'
import { useIdentity } from './identity'
import styles from './shell.module.css'

function ViewRoute({ dashboard = false }: { dashboard?: boolean }) {
  const { id } = useParams()
  const role = useIdentity((state) => state.role)
  if (!can(role, 'view')) return <Result status="403" title="Access denied" />
  if (dashboard) return <DashboardView />
  const scope = id ?? 'list'
  return <DeploymentView key={scope} scope={scope} />
}

export function DemoApp() {
  const client = useQueryClient()
  const navigate = useNavigate()
  const { role, setRole } = useIdentity()
  const [resetting, setResetting] = useState(false)
  const [resetError, setResetError] = useState('')

  async function reset() {
    setResetting(true)
    setResetError('')
    try {
      await client.cancelQueries()
      await resetDemo()
      client.clear()
      setRole('Developer')
      navigate('/deployments', { replace: true })
    } catch (error) {
      setResetError(error instanceof Error ? error.message : 'Reset failed.')
    } finally {
      setResetting(false)
    }
  }

  return (
    <ConfigProvider
      locale={enUS}
      theme={{ token: { colorPrimary: '#087fa3', borderRadius: 6 } }}
    >
      <App>
        <header className={styles.header}>
          <div className={styles.brand}>
            <strong>DMS</strong>
            <span>Deployment Management System</span>
          </div>
          <div className={styles.controls}>
            <span className={styles.demo}>Interview demo</span>
            <label>
              Demo role{' '}
              <select
                disabled={resetting}
                value={role}
                onChange={(event) => {
                  const next = ROLES.find(
                    (candidate) => candidate === event.target.value,
                  )
                  if (next) setRole(next)
                }}
              >
                {ROLES.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <Button disabled={resetting} onClick={() => void reset()}>
              Reset demo
            </Button>
          </div>
        </header>
        <nav className={styles.nav} aria-label="Main navigation">
          {can(role, 'view') && (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/deployments">Deployments</NavLink>
            </>
          )}
        </nav>
        <main className={styles.main}>
          {resetError && <Alert type="error" title={resetError} showIcon />}
          {resetting ? (
            <Spin description="Resetting demo..." fullscreen />
          ) : (
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<ViewRoute dashboard />} />
              <Route path="/deployments" element={<ViewRoute />} />
              <Route path="/deployments/:id" element={<ViewRoute />} />
              <Route
                path="*"
                element={<Result status="404" title="Page not found" />}
              />
            </Routes>
          )}
        </main>
      </App>
    </ConfigProvider>
  )
}
