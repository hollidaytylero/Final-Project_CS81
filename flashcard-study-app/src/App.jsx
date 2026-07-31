import { useEffect, useState } from "react";
import "./App.css";

const starterCards = [
  {
    id: 1,
    question: "What does HTML stand for?",
    answer: "HyperText Markup Language",
  },
  {
    id: 2,
    question: "What does CSS control?",
    answer: "The appearance and layout of a webpage",
  },
  {
    id: 3,
    question: "What is JavaScript used for?",
    answer: "Adding interactivity and dynamic behavior to webpages",
  },
  {
    id: 4,
    question: "What React hook manages component state?",
    answer: "useState",
  },
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