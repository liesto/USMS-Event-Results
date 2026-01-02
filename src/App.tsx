import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SwimmerResultsPage } from '@/components/swimmer-results-page'
import { TopTimesPage } from '@/components/top-times-page'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/individual-results" element={<SwimmerResultsPage />} />
        <Route path="/top-times" element={<TopTimesPage />} />
        <Route path="/" element={<Navigate to="/individual-results" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
