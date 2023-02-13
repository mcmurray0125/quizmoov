import { useState, useEffect } from "react"
import movieQuotes from "movie-quotes"
import { Container } from "react-bootstrap"
import Navigation from "./Navigation"

function App() {
const [allQuotes, setAllQuotes] = useState(movieQuotes.all) //movieQuotes.all returns an Array of 100 quotes + titles.
const [fourQuotes, setFourQuotes] = useState([])
const [options, setOptions] = useState([])
const [chosenMovie, setChosenMovie] = useState("")
const [chosenQuote, setChosenQuote] = useState("")
const [scrambledOptions, setScrambledOptions] = useState([])

//Select 4 random Quotes + titles. Picks one as the chosen answer.
useEffect(() => {
  let selectedQuotes = []
  for (let i = 0; i < 4; i++) {
    let randomQuotes = Math.floor(Math.random() * allQuotes.length);
    selectedQuotes.push(allQuotes[randomQuotes]);
  }
  console.log(selectedQuotes)
  setFourQuotes(selectedQuotes)
  setChosenMovie(selectedQuotes[0])
},[])

//Sets options to 4 movie titles. Quotes are removed from strings.
useEffect(() => {
  let movieOptions = []
  fourQuotes.forEach(function (item) {
    let substrings = item.split('" ');
    movieOptions.push(substrings[substrings.length - 1])
  })
  //Scrambles the options.
  movieOptions.sort(() => Math.random() - 0.5);
  setOptions(movieOptions)
},[fourQuotes])


//Splits the chosen string to only display the quote. Title is removed from string.
useEffect(() => {
  let str = chosenMovie;
  let lastIndex = str.lastIndexOf('" ');
  setChosenQuote(str.substring(0, lastIndex + 2))
},[chosenMovie])


useEffect(() => {
console.log(chosenMovie)
console.log(options)
console.log(chosenQuote)
},[options, fourQuotes, chosenQuote])


  return (
    <>
      <Navigation/>
      <Container className="text-center mt-5">
        <h2>{chosenQuote}</h2>
      </Container>
    </>
  )
}

export default App
