import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Result from './pages/Result';
import ErrorBoundary from './ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/result/:username" element={<Result />} />
      </Routes>
    </Router>
    </ErrorBoundary>
  );
}

export default App;