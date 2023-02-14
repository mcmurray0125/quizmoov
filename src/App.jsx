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
const [quiz, setQuiz] = useState()

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

//Stores quiz data in Quiz State
useEffect(() => {
  if (correctQuote && options.length > 0) {
    setQuiz({
      correctMovie: correctMovie,
      correctQuote: correctQuote,
      options: options.map((option, index) => {
        return {
          title: option,
          guessed: false,
          key: index,
          correct: null
        };
      }),
      id: nanoid(),
    });
  }
}, [correctQuote, options]);

//Changes property of mulitple choice option when selected in radio group.
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

function handleSubmit(event) {
  event.preventDefault();
  setQuiz((oldQuiz) => ({
    ...oldQuiz,
    options: oldQuiz.options.map((option) => {
      if (correctMovie.includes(option.title)) {
        return {
          ...option,
          correct: true,
        };
      } else if (option.guessed && !correctMovie.includes(option.title)) {
        return {
          ...option,
          correct: false,
        };
      } else if (option.guessed && correctMovie.includes(option.title)) {
        return {
          ...option,
          correct: true,
        };
      } else {
        return option;
      }
    }),
  }));
}

const getClassname = (option) => {
  if (option.correct === true) {
    return 'correct option';
  } else if (option.correct === false && option.guessed) {
    return 'incorrect option';
  } else if (option.guessed) {
    return 'selected option';
  } else {
    return 'option';
  }
};

  return (
    <>
      <Navigation/>
      <Container className="text-center my-5">
      <h4 className="mb-5">What movie is this quote from?</h4>
      <h3 className="mb-5">{correctQuote}</h3> 
      <Form className="text-center" onSubmit={handleSubmit}>
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
            <label htmlFor={option.key} className={getClassname(option)}>
              {option.title}
            </label>
          </div>
        ))}
        <button className="submit-btn my-3" type="submit">Submit</button>
      </Form>
      </Container>
    </>
  )
}

export default App
