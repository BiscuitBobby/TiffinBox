
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import { Layout } from './components/layout'
import Lander from './components/lander'
import ContainerManager from './components/container-manager'
import ContainerCard from './components/container-card';

function App() {




  return (
 <Router>
      <Routes>
        <Route path="/" element={<Lander />} />
        <Route path="/containers" element={ 
          <Layout><ContainerManager /></Layout>} />
        <Route path="/container" element={
          <Layout><ContainerCard /></Layout>
        } />
      </Routes>
 </Router>
   
    
  )
}

export default App

