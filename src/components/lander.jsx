import PropTypes from "prop-types"
import { useState, useEffect } from "react"
import { ArrowRight, Box, Check, Loader2, Terminal } from "lucide-react"
import { invoke } from "@tauri-apps/api/core"
import { useNavigate } from "react-router-dom"


export default function Lander() {
  const [isLoading, setIsLoading] = useState(true)
  const [isDistroboxInstalled, setIsDistroboxInstalled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkDistrobox = async () => {
      try {
       
        const response = await invoke('check_distrobox');
  
        if(response){
          console.log('Distrobox is installed',response);
          setIsDistroboxInstalled(true)
         
        }
        else{
          console.log('Distrobox is not installed',response);
          setIsDistroboxInstalled(false)
          
          
        }
      } catch (error) {
        console.error('Error calling Rust function:', error);
        
      }
      finally{
        setIsLoading(false);
      }
     
     
    }

    checkDistrobox()
  }, [])

  function handleCreate(){
    console.log('Create new container');
    navigate('/containers'); 
  }
  


  return (

    <div className="h-full overflow-hidden  bg-zinc-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-purple-500/10 to-blue-500/10" />

        {/* Content */}
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl">
              Welcome to TiffinBox
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
              Easily manage and create containers with Distrobox. A modern solution for container management.
            </p>
            {/* <div className="mt-10">
              <button className="group inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-orange-600 hover:scale-105" onClick={handleLoad}>
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-8">
            {!isDistroboxInstalled ? (
              <div className="w-full max-w-2xl animate-fade-in rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center backdrop-blur">
                <Terminal className="mx-auto h-12 w-12 text-orange-500" />
                <h2 className="mt-4 text-xl font-semibold text-zinc-100">Distrobox Not Installed</h2>
                <p className="mt-2 text-zinc-400">
                  To get started with ContainerBox, you&apos;ll need to install Distrobox first.
                </p>
                <a
                  href="https://distrobox.it/#installation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-orange-600 hover:scale-105"
                >
                  Install Distrobox
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            ) : (
              <div className="w-full max-w-2xl animate-fade-in text-center">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 backdrop-blur">
                  <Box className="mx-auto h-12 w-12 text-orange-500" />

                  <h2 className="mt-4 text-xl font-semibold text-zinc-100" >Create a New Container</h2>
                  <p className="mt-2 text-zinc-400">Start managing your containers with ease using ContainerBox.</p>
                  <button className="group mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-orange-600 hover:scale-105" onClick={handleCreate}>
                    Create New Container
                    <Check className="h-4 w-4 transition-transform group-hover:scale-110" />
                  </button>
                </div>
              </div>
            )}

            {/* Features Grid */}
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Easy Setup",
                  description: "Get started quickly with simple installation and configuration.",
                  icon: Terminal,
                },
                {
                  title: "Container Management",
                  description: "Create and manage containers with an intuitive interface.",
                  icon: Box,
                },
                {
                  title: "Resource Efficient",
                  description: "Optimize resource usage with efficient container management.",
                  icon: Check,
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur transition-colors hover:border-orange-500/50 hover:bg-zinc-900"
                >
                  <feature.icon className="h-8 w-8 text-orange-500" />
                  <h3 className="mt-4 text-lg font-semibold text-zinc-100">{feature.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

    
      
    </div>
  )
}


Lander.propTypes = {
    toggle: PropTypes.func.isRequired,
  }
