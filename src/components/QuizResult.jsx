import React from 'react'

export default function QuizResult({quiz, correctMovie, correctQuote, id, options, win }) {

  const getClassname = (option) => {
    if (option.correct === true) {
      return 'correct result';
    } else if (option.correct === false && option.guessed) {
      return 'incorrect result';
    } else if (option.guessed) {
      return 'selected result';
    } else {
      return 'result';
    }
  };

  return (
    <div className='quiz-result'>
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
