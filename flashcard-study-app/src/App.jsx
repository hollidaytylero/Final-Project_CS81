import { useEffect, useState } from "react";
import "./App.css";

const starterCards = [
  {
    id: 1,
    question: "Why did the JavaScript developer wear glasses?",
    answer: "Because they couldn't C#."
  },
  {
    id: 2,
    question: "Why don't skeletons fight each other?",
    answer: "They don't have the guts."
  },
  {
    id: 3,
    question: "What do you call fake spaghetti?",
    answer: "An impasta."
  },
  {
    id: 4,
    question: "Why did the scarecrow win an award?",
    answer: "Because he was outstanding in his field."
  },
  {
    id: 5,
    question: "What happens when you forget to save your project?",
    answer: "Character development."
  },
  {
    id: 6,
    question: "How do programmers cry?",
    answer: "console.log('😭');"
  },
  {
    id: 7,
    question: "What's the fastest way to find a typo?",
    answer: "Submit the assignment."
  },
  {
    id: 8,
    question: "Why did the computer go to therapy?",
    answer: "It had too many unresolved issues."
  },
  {
    id: 9,
    question: "Why don't eggs tell jokes?",
    answer: "Because they'd crack each other up."
  },
  {
    id: 10,
    question: "What's orange and sounds like a parrot?",
    answer: "A carrot."
  }
];

function App() {
  const [cards, setCards] = useState(() => {
    const savedCards = localStorage.getItem("flashcards");

    return savedCards ? JSON.parse(savedCards) : starterCards;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("flashcards", JSON.stringify(cards));
  }, [cards]);

  function flipCard() {
    setIsFlipped((previousValue) => !previousValue);
  }

  function showNextCard() {
    if (cards.length === 0) {
      return;
    }

    setCurrentIndex((previousIndex) =>
      previousIndex === cards.length - 1 ? 0 : previousIndex + 1
    );

    setIsFlipped(false);
  }

  function showPreviousCard() {
    if (cards.length === 0) {
      return;
    }

    setCurrentIndex((previousIndex) =>
      previousIndex === 0 ? cards.length - 1 : previousIndex - 1
    );

    setIsFlipped(false);
  }

  function shuffleCards() {
    const shuffledCards = [...cards];

    for (let index = shuffledCards.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1));

      [shuffledCards[index], shuffledCards[randomIndex]] = [
        shuffledCards[randomIndex],
        shuffledCards[index],
      ];
    }

    setCards(shuffledCards);
    setCurrentIndex(0);
    setIsFlipped(false);
  }

  function addCard(event) {
    event.preventDefault();

    if (!question.trim() || !answer.trim()) {
      setErrorMessage("Please enter both a question and an answer.");
      return;
    }

    const newCard = {
      id: Date.now(),
      question: question.trim(),
      answer: answer.trim(),
    };

    setCards((previousCards) => [...previousCards, newCard]);
    setQuestion("");
    setAnswer("");
    setErrorMessage("");
  }

  function deleteCurrentCard() {
    if (cards.length === 0) {
      return;
    }

    const updatedCards = cards.filter(
      (_, index) => index !== currentIndex
    );

    setCards(updatedCards);
    setCurrentIndex(0);
    setIsFlipped(false);
  }

  function resetDeck() {
    setCards(starterCards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setErrorMessage("");
  }

  const currentCard = cards[currentIndex];

  return (
    <main className="app">
      <header className="header">
        <h1>Flashcard Study App</h1>
        <p>Click the card to reveal the answer.</p>
      </header>

      <section className="study-section">
        {cards.length > 0 ? (
          <>
            <p className="progress">
              Card {currentIndex + 1} of {cards.length}
            </p>

            <button
              className={`flashcard ${isFlipped ? "flipped" : ""}`}
              onClick={flipCard}
              aria-label="Flip flashcard"
            >
              <span className="card-label">
                {isFlipped ? "Answer" : "Question"}
              </span>

              <span className="card-content">
                {isFlipped
                  ? currentCard.answer
                  : currentCard.question}
              </span>

              <span className="card-instruction">
                Click to flip
              </span>
            </button>

            <div className="controls">
              <button onClick={showPreviousCard}>Previous</button>
              <button onClick={flipCard}>Flip Card</button>
              <button onClick={showNextCard}>Next</button>
            </div>

            <div className="deck-controls">
              <button onClick={shuffleCards}>Shuffle Deck</button>

              <button
                className="delete-button"
                onClick={deleteCurrentCard}
              >
                Delete Card
              </button>
            </div>
          </>
        ) : (
          <div className="empty-message">
            <h2>Your flashcard deck is empty.</h2>
            <p>Add a new card below or restore the starter cards.</p>
            <button onClick={resetDeck}>Restore Starter Cards</button>
          </div>
        )}
      </section>

      <section className="form-section">
        <h2>Create a New Flashcard</h2>

        <form onSubmit={addCard}>
          <label htmlFor="question">Question</label>
          <input
            id="question"
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Enter a question"
          />

          <label htmlFor="answer">Answer</label>
          <textarea
            id="answer"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="Enter the answer"
            rows="4"
          />

          {errorMessage && (
            <p className="error-message">{errorMessage}</p>
          )}

          <button className="add-button" type="submit">
            Add Flashcard
          </button>
        </form>
      </section>

      <footer>
        <button className="reset-button" onClick={resetDeck}>
          Reset Entire Deck
        </button>
      </footer>
    </main>
  );
}

export default App;
