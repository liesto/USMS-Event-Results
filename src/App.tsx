import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SwimmerResultsPageReal } from '@/components/swimmer-results-page-real'
import { TopTimesPage } from '@/components/top-times-page'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/individual-results" element={<SwimmerResultsPageReal />} />
          <Route path="/top-times" element={<TopTimesPage />} />
          <Route path="/" element={<Navigate to="/individual-results" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
