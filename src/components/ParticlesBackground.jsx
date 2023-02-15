import { useCallback } from "react"
import Particles from "react-tsparticles"
import { loadFull } from 'tsparticles'
import particlesConfig from "./config/particles-config"

const ParticlesBackground = () => {

  const init = useCallback(async (engine) => {
    await loadFull(engine)
  })

  return (
    <Particles params={particlesConfig} init={init}></Particles>
  )
}

export default ParticlesBackground
