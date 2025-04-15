import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Input } from './components/atoms/input/Input'
import { TextInput } from './components/molecules/textInput/TextInput'
import { Checkbox } from './components/molecules/checkbox/Checkbox'

function App() {
  const [text, setText] = useState<string>('')
  const [checked, setChecked] = useState<boolean>(false)
  

  return (
    <>
      <TextInput value={text} onChange={(event) => setText(event.target.value)}  />
      <Checkbox id={'test'} disabled label={'test'} checked={checked} onChange={(e) => setChecked(e.target.checked)} />
    </>
  )
}

export default App
