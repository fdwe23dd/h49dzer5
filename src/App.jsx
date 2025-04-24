import { useState } from 'react'
import './App.css'
import AICopilot from './components/ai-copilot.tsx'

function App() {
  const [count, setCount] = useState(0)

  return (
<div className="App">
<AICopilot />
    </div>
  )
}

export default App
