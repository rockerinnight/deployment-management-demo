import { expect, test } from '@playwright/test'

test('failed rollout and rollback stream progress without refetching the list', async ({
  page,
}) => {
  const snapshots: string[] = []
  const remote: string[] = []
  const streams: string[] = []
  page.on('request', (request) => {
    const url = new URL(request.url())
    if (url.hostname !== 'localhost') remote.push(url.href)
    if (request.method() === 'GET' && url.pathname === '/api/deployments')
      snapshots.push(url.href)
    if (url.pathname === '/api/progress')
      streams.push(...url.searchParams.getAll('id'))
  })

  await page.goto('/deployments')
  await page.getByRole('button', { name: 'Reset demo' }).click()
  await page.getByLabel('Environment').selectOption('Staging')
  await page.getByRole('button', { name: 'Add new' }).press('Enter')
  const form = page.getByRole('dialog', { name: 'New deployment request' })
  await form.getByLabel('Application').selectOption('Orders API')
  await form.getByRole('button', { name: 'Create request' }).click()
  await expect(form.getByText('Select an environment.')).toBeVisible()
  await expect(form.getByRole('option', { name: 'Production' })).toBeDisabled()
  await form.getByLabel('Environment').selectOption('Staging')
  await form.getByLabel('Version').fill('1.9.0')
  await form.getByLabel('Scenario').selectOption('fail')
  await form.getByRole('button', { name: 'Create request' }).click()
  await expect(
    page.getByText('Approval Pending', { exact: true }),
  ).toBeVisible()
  await expect(page.getByRole('button', { name: 'Approve' })).toHaveCount(0)
  await page.getByLabel('Demo role').selectOption('Operator')
  await page.getByRole('button', { name: 'Approve' }).click()
  await expect(page.getByRole('progressbar')).toHaveAttribute(
    'aria-valuenow',
    '25',
  )
  await expect(
    page.getByText('Health check failed. The new build is unhealthy.'),
  ).toBeVisible()

  await page
    .getByRole('main')
    .getByRole('link', { name: 'Deployments' })
    .click()
  await page.getByLabel('Environment').selectOption('Staging')
  const rows = page.locator('tbody tr[data-row-key]')
  await expect(rows).toHaveCount(10)
  const before = snapshots.length
  const original = rows.filter({ hasText: '1.9.0' })
  await expect(original.getByText('Failed')).toBeVisible()
  const dropped = await rows.last().getAttribute('data-row-key')
  await original.getByRole('button', { name: 'Rollback' }).click()
  await page.getByRole('button', { name: 'Roll back', exact: true }).click()
  await expect(rows.first()).toContainText('1.8.0')
  await expect(rows.first().getByRole('progressbar')).toHaveAttribute(
    'aria-valuenow',
    '25',
  )
  await expect(rows.first().getByText('Success')).toBeVisible()
  await expect(rows).toHaveCount(10)
  await expect(
    rows.filter({ has: page.getByRole('link', { name: dropped ?? '' }) }),
  ).toHaveCount(0)
  await expect(original.getByText('Failed')).toBeVisible()
  expect(snapshots).toHaveLength(before)
  expect(streams).toContain('DEP-011')
  expect(remote).toEqual([])
  await rows.first().getByRole('link').click()
  await expect(page.getByText('Build 1.8.0 restored in Staging.')).toBeVisible()
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Dashboard' })
    .click()
  const summary = page.getByRole('region', { name: 'Deployment summary' })
  await expect(summary.getByText('12', { exact: true })).toBeVisible()
  await expect(summary.getByText('11', { exact: true })).toBeVisible()
  await expect(summary.getByText('1', { exact: true })).toBeVisible()
  await expect(page.locator('tbody tr[data-row-key]').first()).toContainText(
    'DEP-012',
  )
})

test('a running snapshot starts tracking on arrival and reset stops tracking', async ({
  page,
}) => {
  await page.setViewportSize({ width: 600, height: 800 })
  await page.goto('/dashboard')
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(600)

  await page.evaluate(() => {
    const close = EventSource.prototype.close
    EventSource.prototype.close = function () {
      document.documentElement.dataset.closedStream = this.url
      return close.call(this)
    }
  })

  const { id, denied } = await page.evaluate(async () => {
    const body = {
      application: 'Orders API',
      environment: 'Staging',
      version: '1.9.0',
      scenario: 'fail',
    }
    const headers = {
      'Content-Type': 'application/json',
      'X-Demo-Role': 'Developer',
    }
    const forbidden = await fetch('/api/deployments', {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...body, environment: 'Production' }),
    })
    const created = await fetch('/api/deployments', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
    const job = await created.json()
    if (
      !created.ok ||
      typeof job !== 'object' ||
      job === null ||
      !('id' in job) ||
      typeof job.id !== 'string'
    )
      throw new Error('Could not create test job.')
    const approved = await fetch(`/api/deployments/${job.id}/approve`, {
      method: 'POST',
      headers: { 'X-Demo-Role': 'Operator' },
    })
    if (!approved.ok) throw new Error('Could not approve test job.')
    return { id: job.id, denied: forbidden.status }
  })
  expect(denied).toBe(403)

  const subscription = page.waitForRequest((request) => {
    const url = new URL(request.url())
    return (
      url.pathname === '/api/progress' &&
      url.searchParams.getAll('id').includes(id)
    )
  })
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Deployments' })
    .click()
  const row = page.locator('tbody tr[data-row-key]').filter({ hasText: id })
  await expect(row.getByText('In Progress')).toBeVisible()
  await subscription

  await page.getByRole('button', { name: 'Reset demo' }).click()
  await expect(page.getByRole('link', { name: 'DEP-010' })).toBeVisible()
  await expect(row).toHaveCount(0)
  await expect(page.getByLabel('Demo role')).toHaveValue('Developer')
  await expect(page.locator('html')).toHaveAttribute(
    'data-closed-stream',
    new RegExp(id),
  )
})
