import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Alert, Button, Descriptions, Empty, Modal, Spin, Timeline } from 'antd'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useIdentity } from '../../app/identity'
import { can } from '../../shared/policy'
import { actOnJob, createJob } from './api'
import { CreateDialog } from './create-dialog'
import { DeploymentTable, JobProgress, StatusBadge } from './deployment-table'
import {
  ENVIRONMENTS,
  jobPage,
  STATUS_LABELS,
  type Action,
  type Job,
  type RequestFields,
} from './model'
import { useDeployments } from './use-deployments'
import styles from './deployment.module.css'

const PAGE_SIZE = 10

export function DeploymentView({ scope }: { scope: string }) {
  const role = useIdentity((state) => state.role)
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [rollbackTarget, setRollbackTarget] = useState<Job>()
  const { jobs, snapshot, track, streamError, getSignal } =
    useDeployments(scope)
  const create = useMutation({
    mutationFn: (fields: RequestFields) => createJob(fields, role, getSignal()),
  })
  const action = useMutation({
    mutationFn: ({ id, kind }: { id: string; kind: Action }) => {
      track([id])
      return actOnJob(id, kind, role, getSignal())
    },
  })

  async function submit(fields: RequestFields) {
    const signal = getSignal()
    try {
      const job = await create.mutateAsync(fields)
      if (!signal.aborted) navigate(`/deployments/${job.id}`)
    } catch {
      // TanStack stores the mutation error for the dialog.
    }
  }

  function actionsFor(job: Job) {
    const kind =
      job.phase === 'pending'
        ? 'approve'
        : job.outcome === 'failure' && job.previousVersion && !job.rollbackId
          ? 'rollback'
          : null
    if (!kind || !can(role, kind)) return null
    return (
      <Button
        size="small"
        type={scope === 'list' ? 'default' : 'primary'}
        disabled={action.isPending}
        loading={action.isPending && action.variables.id === job.id}
        onClick={() => {
          if (kind === 'approve') action.mutate({ id: job.id, kind })
          else setRollbackTarget(job)
        }}
      >
        {kind === 'approve' ? 'Approve' : 'Rollback'}
      </Button>
    )
  }

  const feedback = (
    <>
      {streamError && (
        <Alert
          type="warning"
          title="Live updates disconnected. Waiting to reconnect."
          showIcon
        />
      )}
      {action.error && (
        <Alert type="error" title={action.error.message} showIcon />
      )}
      {rollbackTarget && (
        <Modal
          open
          title={`Roll back to ${rollbackTarget.previousVersion}?`}
          okText="Roll back"
          onCancel={() => setRollbackTarget(undefined)}
          okButtonProps={{ disabled: !can(role, 'rollback') }}
          onOk={() => {
            action.mutate({ id: rollbackTarget.id, kind: 'rollback' })
            setRollbackTarget(undefined)
          }}
        >
          This creates a new deployment. The original job remains failed.
        </Modal>
      )}
    </>
  )

  if (snapshot.isError)
    return (
      <Alert
        type="error"
        title={snapshot.error.message}
        showIcon
        action={<Button onClick={() => void snapshot.refetch()}>Retry</Button>}
      />
    )
  if (!jobs) return <Spin description="Loading deployments..." fullscreen />

  if (scope !== 'list') {
    const job = jobs.find((record) => record.id === scope)
    if (!job) return <Empty description="Deployment not found." />
    return (
      <div className={styles.stack}>
        <div className={styles.crumb}>
          <Link to="/deployments">Deployments</Link> / {job.id}
        </div>
        <div className={styles.heading}>
          <div>
            <h1>
              {job.application}{' '}
              <span className={styles.muted}>{job.version}</span>
            </h1>
            <StatusBadge job={job} />{' '}
            <span className={styles.muted}>
              {job.id} · {new Date(job.createdAt).toLocaleString('en-US')}
            </span>
          </div>
          {actionsFor(job)}
        </div>
        {feedback}
        {job.phase === 'pending' && !can(role, 'approve') && (
          <Alert
            type="info"
            showIcon
            title="Switch to Operator or Admin to approve this request."
          />
        )}
        <Descriptions
          bordered
          size="small"
          items={[
            { key: 'project', label: 'Project', children: 'Aurora Commerce' },
            { key: 'app', label: 'Application', children: job.application },
            { key: 'env', label: 'Environment', children: job.environment },
            { key: 'version', label: 'Build', children: job.version },
            {
              key: 'progress',
              label: 'Progress',
              children: <JobProgress job={job} />,
            },
            ...(job.rollbackId
              ? [
                  {
                    key: 'recovery',
                    label: 'Rollback job',
                    children: (
                      <Link to={`/deployments/${job.rollbackId}`}>
                        {job.rollbackId}
                      </Link>
                    ),
                  },
                ]
              : []),
            ...(job.rollbackOf
              ? [
                  {
                    key: 'original',
                    label: 'Failed deployment',
                    children: (
                      <Link to={`/deployments/${job.rollbackOf}`}>
                        {job.rollbackOf}
                      </Link>
                    ),
                  },
                ]
              : []),
          ]}
        />
        {job.rollbackOf && job.outcome === 'success' && (
          <Alert
            type="success"
            showIcon
            title={`Build ${job.version} restored in ${job.environment}.`}
          />
        )}
        <section>
          <h2>Execution log</h2>
          <Timeline items={job.logs.map((message) => ({ content: message }))} />
        </section>
      </div>
    )
  }

  const environment = params.get('environment') ?? ''
  const status = params.get('status') ?? ''
  const requestedPage = Number(params.get('page'))
  const { rows, total, page } = jobPage(
    jobs,
    environment,
    status,
    requestedPage,
    PAGE_SIZE,
  )

  function setFilter(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('page')
    setParams(next)
  }

  return (
    <div className={styles.stack}>
      <div className={styles.crumb}>
        Deployment Management / Deployment history
      </div>
      <div className={styles.heading}>
        <div>
          <h1>Deployments</h1>
          <p className={styles.muted}>
            Review requests and track releases for Aurora Commerce.
          </p>
        </div>
        <Button type="primary" onClick={() => setDialogOpen(true)}>
          Add new
        </Button>
      </div>
      <div className={styles.filters}>
        <label>
          Environment
          <select
            value={environment}
            onChange={(event) => setFilter('environment', event.target.value)}
          >
            <option value="">All environments</option>
            {ENVIRONMENTS.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select
            value={status}
            onChange={(event) => setFilter('status', event.target.value)}
          >
            <option value="">All statuses</option>
            {Object.entries(STATUS_LABELS).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <Button onClick={() => setParams({})}>Clear filters</Button>
      </div>
      {feedback}
      <DeploymentTable
        rows={rows}
        emptyText="No deployments match these filters."
        actions={actionsFor}
        pagination={{
          current: page,
          pageSize: PAGE_SIZE,
          total,
          showSizeChanger: false,
          onChange: (value) => {
            const next = new URLSearchParams(params)
            next.set('page', String(value))
            setParams(next)
          },
        }}
      />
      {dialogOpen && (
        <CreateDialog
          role={role}
          pending={create.isPending}
          error={create.error?.message}
          onSubmit={submit}
          onClose={() => {
            create.reset()
            setDialogOpen(false)
          }}
        />
      )}
    </div>
  )
}
