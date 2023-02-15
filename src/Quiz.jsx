import { useState, useEffect } from "react"
import { nanoid } from "nanoid"
import movieQuotes from "movie-quotes"
import ParticlesBackground from "./components/ParticlesBackground"
import { Container, Form } from "react-bootstrap"
import Navigation from "./Navigation"

function Quiz() {
  const [options, setOptions] = useState([])
  const [correctMovie, setCorrectMovie] = useState("")
  const [correctQuote, setCorrectQuote] = useState("")
  const [quiz, setQuiz] = useState()
  const [winner, setWinner] = useState(false)
  const [checked, setChecked] = useState(false)
  const [message, setMessage] = useState("")

const newQuote = () => {
  const quotes = (movieQuotes.all)
  let selectedQuotes = []
  for (let i = 0; i < 4; i++) {
    let randomQuotes = Math.floor(Math.random() * quotes.length);
    selectedQuotes.push(quotes[randomQuotes]);
  }
  setCorrectMovie(selectedQuotes[0])

  let movieOptions = []
  selectedQuotes.forEach(function (item) {
    let substrings = item.split('" ');
    movieOptions.push(substrings[substrings.length - 1])
  })

  movieOptions.sort(() => Math.random() - 0.5);
  setOptions(movieOptions)
}

const [allQuotes, setAllQuotes] = useState(newQuote)

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
}, [correctQuote, options, allQuotes]);

//Changes property of mulitple choice option when selected in radio group.
function selectMovie(key) {
  setQuiz((oldQuiz) => ({
    ...oldQuiz,
    options: oldQuiz.options.map((option) =>
      option.key === key
        ? { ...option, guessed: true }
        : { ...option, guessed: false }
    ),
  }));
}


function handleSubmit(event) {
  event.preventDefault();
  setChecked(true)
  setQuiz((oldQuiz) => ({
    ...oldQuiz,
    options: oldQuiz.options.map((option) => {
      if (!option.guessed && correctMovie.includes(option.title)) {
        return {
          ...option,
          correct: true,
        };
      } else if (option.guessed && !correctMovie.includes(option.title)) {
        setMessage("Sorry, that's not correct.")
        return {
          ...option,
          correct: false,
        };
      } else if (option.guessed && correctMovie.includes(option.title)) {
        console.log("winner")
        setWinner(true)
        setMessage("Nice! You got it!")
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

//Resets quiz States with slide animation.
function newQuiz(event) {
  event.preventDefault();
  const quizSection = document.querySelector('.quiz');
  quizSection.classList.add('slide-out');
  setTimeout(() => {
    setQuiz(null);
    setAllQuotes(newQuote);
    setWinner(false);
    setChecked(false);
    quizSection.classList.remove('slide-out');
  }, 700);
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
      {winner && <ParticlesBackground />}
      <Container className="text-center my-5">
      <h4 className="mb-5">What movie is this quote from?</h4>
      <section className="quiz">
        <h3 className="mb-5">{correctQuote}</h3> 
        <Form className="text-center" onSubmit={checked ? newQuiz : handleSubmit}>
          {quiz && quiz.options.map((option) => (
            <div className="radio-btn my-3" key={option.key}>
              <input
                disabled={checked ? true : false}
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
          {checked && <p className="my-4" style={{color: winner ? 'rgb(51, 206, 90)' : 'rgb(220, 89, 53)'}}>{message}</p>}
          <button className="submit-btn" type="submit">{checked ? 'Next Quote' : 'Submit'}</button>
        </Form>
      </section>
      </Container>
    </>
  )
}

export default Quiz
