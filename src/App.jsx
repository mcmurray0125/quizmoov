import { useState, useEffect } from "react"
import { nanoid } from "nanoid"
import movieQuotes from "movie-quotes"
import { Container, Form } from "react-bootstrap"
import Navigation from "./Navigation"

function App() {
const [allQuotes, setAllQuotes] = useState(movieQuotes.all) //movieQuotes.all returns an Array of 100 quotes + titles.
const [options, setOptions] = useState([])
const [correctMovie, setCorrectMovie] = useState("")
const [correctQuote, setCorrectQuote] = useState("")
const [quiz, setQuiz] = useState ()

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
console.log(quiz)
},[quiz])

useEffect(() => {
  if (correctQuote && options.length > 0) {
    setQuiz({
      correctMovie: correctMovie,
      correctQuote: correctQuote,
      options: options.map((option, index) => {
        return {
          title: option,
          guessed: false,
          key: index
        };
      }),
      id: nanoid(),
      correct: false,
    });
  }
}, [correctQuote, options]);



function selectMovie(key) {
  setQuiz(oldQuiz => ({
    ...oldQuiz,
    options: oldQuiz.options.map(option => {
      return option.key === key ? 
          {...option, guessed: true} :
          {...option, guessed: false}
    })
  }))
}

  return (
    <>
      <Navigation/>
      <Container className="text-center my-5">
      <h4 className="mb-5">What movie is this quote from?</h4>
      <h3 className="mb-5">{correctQuote}</h3> 
      <Form className="text-center">
        {quiz && quiz.options.map((option) => (
          <div className="radio-btn my-3" key={option.key}>
            <input
              type="radio"
              id={option.key}
              name="group-1"
              onChange={() => selectMovie(option.key)}
              className="visually-hidden"
              checked={option.guessed}
            />
            <label htmlFor={option.key} className={`option ${option.guessed ? 'selected-option' : ''}`}>
              {option.title}
            </label>
          </div>
        ))}
        <button className="submit-btn my-3">Submit</button>
      </Form>
      </Container>
    </>
  )
}

export default App
