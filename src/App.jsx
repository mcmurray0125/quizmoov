import { useState, useEffect } from "react"
import { nanoid } from "nanoid"
import movieQuotes from "movie-quotes"
import { Container } from "react-bootstrap"
import Navigation from "./Navigation"

function App() {
const [allQuotes, setAllQuotes] = useState(movieQuotes.all) //movieQuotes.all returns an Array of 100 quotes + titles.
const [options, setOptions] = useState([])
const [correctMovie, setCorrectMovie] = useState("")
const [correctQuote, setCorrectQuote] = useState("")
const [quiz, setQuiz] = useState ({})

useEffect(() => {
  let selectedQuotes = []
  for (let i = 0; i < 4; i++) {
    let randomQuotes = Math.floor(Math.random() * allQuotes.length);
    selectedQuotes.push(allQuotes[randomQuotes]);
  }
  setCorrectMovie(selectedQuotes[0])

  let movieOptions = []
  selectedQuotes.forEach(function (item) {
    let substrings = item.split('" ');
    movieOptions.push(substrings[substrings.length - 1])
  })

  movieOptions.sort(() => Math.random() - 0.5);
  setOptions(movieOptions)
}, [])



//Splits the chosen string to only display the quote. Title is removed from string.
useEffect(() => {
  let str = correctMovie;
  let lastIndex = str.lastIndexOf('" ');
  setCorrectQuote(str.substring(0, lastIndex + 2))
},[correctMovie])

useEffect(() => {
console.log(options)
console.log(correctQuote)
console.log(quiz)
},[quiz])

useEffect(() => {
  setQuiz({
    correctMovie: correctMovie,
    correctQuote: correctQuote,
    options: options.map((option, index) => {
      return {
        title: option,
        guessed: false,
      };
    }),
    id: nanoid(),
    correct: false,
  });
}, [correctQuote]);

  return (
    <>
      <Navigation/>
      <Container className="text-center mt-5">
        <h4 className="mb-5">What movie is this quote from?</h4>
        <h3>{correctQuote}</h3>
      </Container>
    </>
  )
}

export default App
