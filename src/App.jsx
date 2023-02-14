import { useState, useEffect } from "react"
import { nanoid } from "nanoid"
import QuizCard from "./components/QuizCard"
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
        <Form>
          {quiz && quiz.options.map((option) => (
              <Form.Check 
                type="radio"
                name="group-1"
                label={option.title}
                key={option.key}
                onChange={() => selectMovie(option.key)}
                className={`${option.guessed ? 'selected-option' : 'option'}`}
              />
          ))}
          </Form>
      </Container>
    </>
  )
}

export default App
