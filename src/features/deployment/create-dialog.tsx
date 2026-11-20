import { Alert, Modal } from 'antd'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { can, type Role } from '../../shared/policy'
import { APPLICATION, requestSchema, type RequestFields } from './model'
import styles from './deployment.module.css'

type Props = {
  role: Role
  pending: boolean
  error?: string
  onClose: () => void
  onSubmit: (fields: RequestFields) => Promise<void>
}

export function CreateDialog({
  role,
  pending,
  error,
  onClose,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestFields>({
    resolver: zodResolver(requestSchema),
  })
  const formId = 'new-deployment'

  return (
    <Modal
      open
      title="New deployment request"
      onCancel={onClose}
      closable={!pending}
      mask={{ closable: false }}
      keyboard={!pending}
      cancelButtonProps={{ disabled: pending }}
      okText="Create request"
      okButtonProps={{ form: formId, htmlType: 'submit' }}
      confirmLoading={pending}
    >
      <form
        id={formId}
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className={styles.form}
      >
        {error && <Alert type="error" title={error} showIcon />}
        <fieldset
          className={styles.fields}
          disabled={pending}
          aria-label="Deployment request fields"
        >
          <label>
            Application
            <select
              {...register('application')}
              aria-invalid={!!errors.application}
              aria-describedby={
                errors.application ? 'application-error' : undefined
              }
            >
              <option value="">Select an application</option>
              <option>{APPLICATION}</option>
            </select>
            {errors.application && (
              <span id="application-error" role="alert">
                {errors.application.message}
              </span>
            )}
          </label>
          <label>
            Environment
            <select
              {...register('environment')}
              aria-invalid={!!errors.environment}
              aria-describedby={
                errors.environment ? 'environment-error' : undefined
              }
            >
              <option value="">Select an environment</option>
              <option>Staging</option>
              <option value="Production" disabled={!can(role, 'production')}>
                Production
              </option>
            </select>
            {errors.environment && (
              <span id="environment-error" role="alert">
                {errors.environment.message}
              </span>
            )}
          </label>
          <label>
            Version
            <input
              {...register('version')}
              placeholder="1.9.0"
              aria-invalid={!!errors.version}
              aria-describedby={errors.version ? 'version-error' : undefined}
            />
            {errors.version && (
              <span id="version-error" role="alert">
                {errors.version.message}
              </span>
            )}
          </label>
          <label>
            Scenario
            <select
              {...register('scenario')}
              aria-invalid={!!errors.scenario}
              aria-describedby={errors.scenario ? 'scenario-error' : undefined}
            >
              <option value="">Select a scenario</option>
              <option value="fail">Simulated health check failure</option>
            </select>
            {errors.scenario && (
              <span id="scenario-error" role="alert">
                {errors.scenario.message}
              </span>
            )}
          </label>
        </fieldset>
        {!can(role, 'production') && (
          <p className={styles.muted}>
            Developers can request Staging deployments only.
          </p>
        )}
      </form>
    </Modal>
  )
}
