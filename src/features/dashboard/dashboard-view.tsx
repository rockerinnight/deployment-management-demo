import { Alert, Button, Card, Spin, Statistic } from 'antd'
import { DeploymentTable } from '../deployment/deployment-table'
import { useDeployments } from '../deployment/use-deployments'
import styles from './dashboard.module.css'

export function DashboardView() {
  const { snapshot, jobs, streamError } = useDeployments('dashboard')
  if (snapshot.isError)
    return (
      <Alert
        type="error"
        title={snapshot.error.message}
        showIcon
        action={<Button onClick={() => void snapshot.refetch()}>Retry</Button>}
      />
    )
  if (!jobs) return <Spin description="Loading dashboard..." fullscreen />

  const counts = [
    { title: 'Total deployments', value: jobs.length },
    {
      title: 'In progress',
      value: jobs.filter((job) => job.phase === 'in-progress').length,
    },
    {
      title: 'Successful',
      value: jobs.filter((job) => job.outcome === 'success').length,
    },
    {
      title: 'Failed',
      value: jobs.filter((job) => job.outcome === 'failure').length,
    },
  ]
  return (
    <div className={styles.dashboard}>
      <h1>Dashboard</h1>
      {streamError && (
        <Alert
          type="warning"
          title="Live updates disconnected. Waiting to reconnect."
          showIcon
        />
      )}
      <section className={styles.summary} aria-label="Deployment summary">
        {counts.map(({ title, value }) => (
          <Card key={title} size="small">
            <Statistic title={title} value={value} />
          </Card>
        ))}
      </section>
      <section aria-labelledby="recent-activity">
        <h2 id="recent-activity">Recent activity</h2>
        <DeploymentTable
          rows={jobs.slice(0, 5)}
          emptyText="No recent deployments."
        />
      </section>
    </div>
  )
}
