import './App.css'
import ContainerCard from './components/container-card'
import { Layout } from './components/layout'


function App() {
  const containers = [
    { name: "Arch 1", status: "running", icon: "src/assets/icons/arch.svg" },
  ]

  return (
    
    <Layout>
      <div className="max-w-full min-w-1/2 max-h-1/2 min-h-1/4">
        {containers.map((container) => (
          <ContainerCard key={container.name} {...container} />
        ))}
      </div>
      </Layout>
    
  )
}

export default App
