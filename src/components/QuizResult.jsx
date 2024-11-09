import React from 'react'

export default function QuizResult({quiz, correctQuote, id, options, win, filter }) {

  //Controls multiple choice colors based on if user choice was correct or not.
  const getClassname = (option) => {
    if (option.correct === true) {
      return 'correct result';
    } else if (option.correct === false && option.guessed) {
      return 'incorrect result';
    } else {
      return 'result';
    }
  };

  //Sets hidden attribute based on filter state and quiz win status/
  const getHidden = (win) => {
    if (filter === "all") {
      return false;
    }
    if (filter === "correct" && !win) {
      return 'hidden';
    }
    if (filter === "incorrect" && win) {
      return 'hidden';
    }
  };

  return (
    <div className='quiz-result p-3 border' hidden={getHidden(win)}>
      <div className='my-2 d-flex align-items-center justify-content-between'>
        <h5 className='m-0'>{correctQuote}</h5>
        {win ? <i className="fa-solid fa-check fs-2" style={{color: "var(--correct-color)"}}></i> : <i className="fa-solid fa-xmark fs-2" style={{color: "var(--incorrect-color)"}}></i>}
      </div>
        {options.map((option, index) => {
            return (
              <p className={getClassname(option)} key={index}>{option.title}</p>
              )
        })}
    </div>
  )
}
