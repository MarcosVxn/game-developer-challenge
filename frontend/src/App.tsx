import { useEffect, useRef } from "react"
import { createGame } from "./game/core/Game"


function App(){
  const gameContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!gameContainer.current) return

    createGame(gameContainer.current)
  }, [])

  return(
    <div
    ref = {gameContainer}
    style={{
      width: '100vw',
      height: '100vh',
    }}
    />
  )

}

export default App