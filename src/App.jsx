import { useState, useEffect } from "react"
import movieQuotes from "movie-quotes"
import { Container } from "react-bootstrap"

function App() {
const [allQuotes, setAllQuotes] = useState(movieQuotes.all) //movieQuotes.all returns an Array of 100 quotes + titles.
const [fourQuotes, setFourQuotes] = useState([])
const [chosenMovie, setChosenMovie] = useState("")
const [chosenTitle, setChosenTitle] = useState("")
const [chosenQuote, setChosenQuote] = useState("")

useEffect(() => {
  let selectedQuotes = []
  for (let i = 0; i < 4; i++) {
    let randomQuotes = Math.floor(Math.random() * allQuotes.length);
    selectedQuotes.push(allQuotes[randomQuotes]);
  }
  setFourQuotes(selectedQuotes)
  setChosenMovie(selectedQuotes[0])
  console.log(fourQuotes);
},[])


useEffect(() => {
  let string = chosenMovie;
  let substrings = string.split('"');
  setChosenTitle(substrings[substrings.length - 1])
},[chosenMovie])

useEffect(() => {
console.log(chosenTitle)
console.log(chosenMovie)

},[chosenTitle])


  return (
    <Container className="text-center mt-5">
      <h1>test</h1>
    </Container>
  )
}

export default App
