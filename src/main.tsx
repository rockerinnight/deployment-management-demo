import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { DemoApp } from './app/demo-app'
import { worker } from './mocks/browser'
import 'antd/dist/reset.css'
import './app/global.css'

const client = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
})
const root = createRoot(document.getElementById('root')!)

try {
  await worker.start({ onUnhandledRequest: 'bypass', quiet: true })
  root.render(
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <DemoApp />
      </BrowserRouter>
    </QueryClientProvider>,
  )
} catch (error) {
  root.render(
    <main role="alert">
      Could not start the demo mock API: {String(error)}
    </main>,
  )
}
