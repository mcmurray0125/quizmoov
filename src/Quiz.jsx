import { useState, useEffect } from "react"
import { nanoid } from "nanoid"
import movieQuotes from "movie-quotes"
import ParticlesBackground from "./components/ParticlesBackground"
import { Container, Form } from "react-bootstrap"
import { db } from "./firebase"
import { useAuth } from './contexts/AuthContext'
import { doc, updateDoc, arrayUnion, increment } from "firebase/firestore";
import Navigation from "./Navigation"

function Quiz() {
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState([])
  const [correctMovie, setCorrectMovie] = useState("")
  const [correctQuote, setCorrectQuote] = useState("")
  const [quiz, setQuiz] = useState()
  const [winner, setWinner] = useState(false)
  const [checked, setChecked] = useState(false)
  const [message, setMessage] = useState("")
  const [updatedQuiz, setUpdatedQuiz] = useState(false);

//Gets new movies + quotes. Sets one as the correct answer.
//Scrambles the movies and sets the to the Options (multiple choice) State.
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
//Sets the formatted quote as the correctQuote.
//correctQuote is displayed on on the quiz.
useEffect(() => {
  let str = correctMovie;
  let lastIndex = str.lastIndexOf('" ');
  setCorrectQuote(str.substring(0, lastIndex + 2))
},[correctMovie])


//Sets initial quiz data in Quiz State
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
      win: false,
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

//Adds Submitted Quiz to firestore doc
const addQuizToFirestore = async () => {
  const savedRef = doc(db, "users", currentUser.uid);
  const quizRef = JSON.stringify(quiz);
  setLoading(true);
    try {
      await updateDoc(savedRef, {
      quizzes: arrayUnion(quizRef),
      totalQuizzes: increment(1),
      wins: increment(winner ? 1 : 0)
    });
  } catch(error) {
    console.log(error)
  }
  setLoading(false)
  setUpdatedQuiz(false)
}

//updates Quiz movie options & sets a Winning State
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

//Sets win property for the Quiz
useEffect(() => {
  if (checked) {
    setQuiz((oldQuiz) => ({
      ...oldQuiz,
      win: winner,
    }));
    setUpdatedQuiz(true)
  }
}, [checked]);

//The updated Quiz is ready to be sent to Firestore database.
useEffect(() => {
  if (updatedQuiz) {
    addQuizToFirestore();
  }
}, [updatedQuiz]);


//Resets quiz with slide animation.
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

//Class names for multiple choice opitons. Controls color.
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
          {checked && <p className="my-4 result-message" style={{color: winner ? 'rgb(51, 206, 90)' : 'rgb(220, 89, 53)'}}>{message}</p>}
          <button className="submit-btn" type="submit">
            {checked ? 'Next Quote' : 'Submit'}
          </button>
        </Form>
      </section>
      </Container>
    </>
  )
}

export default Quiz
