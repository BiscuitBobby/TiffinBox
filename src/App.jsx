import './App.css'
import ContainerCard from './components/container-card'
import { Layout } from './components/layout'


function App() {
  const containers = [
    { name: "web-server", status: "running", cpu: 25, memory: 40, disk: 10 },
    { name: "database", status: "running", cpu: 35, memory: 60, disk: 30 },
    { name: "cache", status: "stopped", cpu: 0, memory: 0, disk: 5 },
  ]

  return (
    
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Container Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {containers.map((container) => (
          <ContainerCard key={container.name} {...container} />
        ))}
      </div>
      </Layout>
    
  )
}

export default App
