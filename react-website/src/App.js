import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route}
    from 'react-router-dom';
import Add from './pages/add';    
import List from './pages/list';
import UploadCsv from './pages/upload';
import HomePage from './pages/index';

function App() {
  return (
    <Router>
    <Navbar />
    <Routes>
        <Route exact path='/' element={<HomePage />} />
        <Route path='/list' element={<List/>} />
        <Route path='/upload' element={<UploadCsv/>} />
        <Route path='/add' element={<Add/>} />
    </Routes>
    </Router>
  );
}

export default App;
