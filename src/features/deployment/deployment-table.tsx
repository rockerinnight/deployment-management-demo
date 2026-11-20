import { Progress, Table, Tag, type TableProps } from 'antd'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { STATUS_LABELS, statusOf, type Job } from './model'
import styles from './deployment.module.css'

const STATUS_COLORS = {
  pending: 'gold',
  'in-progress': 'orange',
  success: 'cyan',
  failure: 'red',
}

export function StatusBadge({ job }: { job: Job }) {
  const status = statusOf(job)
  return (
    <Tag color={STATUS_COLORS[status]} className={styles.badge}>
      {STATUS_LABELS[status]}
    </Tag>
  )
}

export function JobProgress({ job }: { job: Job }) {
  return (
    <Progress
      size="small"
      percent={job.progress}
      status={job.outcome === 'failure' ? 'exception' : 'normal'}
    />
  )
}

export function DeploymentTable({
  rows,
  pagination = false,
  actions,
  emptyText,
}: {
  rows: Job[]
  pagination?: TableProps<Job>['pagination']
  actions?: (job: Job) => ReactNode
  emptyText: string
}) {
  return (
    <Table
      rowKey="id"
      size="middle"
      dataSource={rows}
      scroll={{ x: actions ? 790 : 670 }}
      locale={{ emptyText }}
      pagination={pagination}
      columns={[
        {
          title: 'Deployment',
          render: (_, job) => (
            <Link to={`/deployments/${job.id}`}>{job.id}</Link>
          ),
        },
        { title: 'Version', dataIndex: 'version' },
        { title: 'Environment', dataIndex: 'environment' },
        { title: 'Application', dataIndex: 'application' },
        { title: 'Status', render: (_, job) => <StatusBadge job={job} /> },
        {
          title: 'Progress',
          width: 150,
          render: (_, job) => <JobProgress job={job} />,
        },
        ...(actions
          ? [
              {
                title: 'Actions',
                width: 105,
                render: (_: unknown, job: Job) => actions(job),
              },
            ]
          : []),
      ]}
    />
  )
}
