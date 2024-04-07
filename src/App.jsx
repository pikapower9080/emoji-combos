import { Fragment, useMemo, useState } from 'react'
import './App.css'
import comboText from './combos.txt?raw'
import copyIcon from './assets/copy-regular.svg'
import copy from 'copy-to-clipboard'
import Fuse from 'fuse.js'

function EmojiCombo(props) {
  return (<>
    <div className='combo'>
      <span className='in-combo-emoji'>{props.emojis}</span>
      <span className="combo-name">{props.name}</span>
    </div>
  </>)
}

function App() {
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState([])

  let comboLines = comboText.split('\n')
  let combos = []
  comboLines.forEach((line) => {
    combos.push({name: line.split(" | ")[0].split(",")[0], emojis: line.split(" | ")[1], keywords: line.split(" | ")[0].split(",")})
  })

  const fuse = useMemo(() => {
    return new Fuse(combos, {keys: ["keywords", "emojis"], threshold: 0.4})
  })

  return (
    <>
      <h1 style={{marginBottom: 10}}>Emoji Combos</h1>
      <h3 style={{marginTop: 1}}>{combos.length} funny and useful emoji combinations you 📋 and ✂️</h3>
      <input onChange={e => {
        if (e.target.value.trim().length == 0) {
          setSearching(false); return
        }
        setSearching(true)
        const searchResults = []
        fuse.search(e.target.value).forEach((result) => {
          searchResults.push(result.item)
        })
        setResults(searchResults)
      }} placeholder='Search...' className='search'></input>
      <main className='main-card'>
          {(searching ? results : combos).map((combo) => <div key={JSON.stringify(combo)} className='combo-container'>
            <EmojiCombo emojis={combo.emojis} name={combo.name} />
              <button className='copy' onClick={() => {
                copy(combo.emojis)
              }}><img src={copyIcon} alt="copy" style={{width: 20, height: 20}}></img></button>
          </div>)}
          {searching && results.length == 0 ? <><span className='in-combo-emoji'>🗿</span><span className='combo-name' style={{fontWeight: "bold"}}>No results found</span></> : ""}
      </main>
    </>
  )
}

export default App
