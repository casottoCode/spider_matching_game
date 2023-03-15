const resetBtn = document.querySelector('#reset')
const container = document.querySelector('#container')
const counter = document.querySelector('#counter')
const floatTitle = document.querySelector('#float-title')
const CARDS_IN_GAME = 5 //10 in total
const LOGO_IMAGE = 'card_icon'
const ACTIVE_FLOAT_TITLE_CLASS = 'active'
const OPEN_CARD_CLASS = 'opened'
const SHOW_IMAGE_TIMEOUT = 350
const TURN_TIMEOUT = 1500
const WIN_TIMEOUT = 3000
const RESTART_GAME_TIMEOUT = 4000
const CARDS = [
  'card_1',
  'card_2',
  'card_3',
  'card_4',
  'card_5',
  'card_6',
  'card_7',
  'card_8',
  'card_9',
  'card_10',
]

const state = {
  points: 0,
  currentOpened: []
}

const getImagePath = name => {
  return `./images/${name}.png`
}

const openCard = imgElement => {
  const selectedCardId = imgElement.getAttribute('id')
  const card = imgElement.parentElement
  card.classList.add(OPEN_CARD_CLASS)
  setTimeout(() => {
    imgElement.setAttribute('src', getImagePath(selectedCardId))
  }, SHOW_IMAGE_TIMEOUT)
}

const closeCard = imgElement => {
  const card = imgElement.parentElement
  card.classList.remove(OPEN_CARD_CLASS)
  setTimeout(() => {
    imgElement.setAttribute('src', getImagePath(LOGO_IMAGE))
  }, SHOW_IMAGE_TIMEOUT)
}

const checkMatch = () => {
  const ids = state.currentOpened.map(cardEl => cardEl.getAttribute('id'))
  if (ids[0] == ids[1]) {
    return true
  }
}

const setWinTitle = win => {
  if (win) {
    floatTitle.classList.add(ACTIVE_FLOAT_TITLE_CLASS)
  } else {
    floatTitle.classList.remove(ACTIVE_FLOAT_TITLE_CLASS)
  }
}

const setCounterDOM = number => {
  counter.innerHTML = number
}

const resetGame = () => {
  container.innerHTML = ''
  state.currentOpened = []
  state.points = 0
  setCounterDOM(0)
  initialize()
}

const checkWin = () => {
  if(state.points == 5) {
    setWinTitle(true)

    setTimeout(() => {
      setWinTitle(false)
    }, WIN_TIMEOUT)

    setTimeout(() => {
      resetGame()
    }, RESTART_GAME_TIMEOUT)
  }
}

const onMatchCard = () => {
  state.points++
  setCounterDOM(state.points)

  state.currentOpened.forEach(imgElement => {
    imgElement.parentElement.style.display = 'none'
  })

  checkWin()
  state.currentOpened = []
}

const onClickCard = event => {
  const { target } = event
  if (state.currentOpened == 2) {
    return event.preventDefault()
  }

  if (state.currentOpened.length < 2) {
    openCard(target)
    state.currentOpened.push(target)
  }

  if (state.currentOpened.length == 2) {
    const isMatch = checkMatch()

    if (isMatch) {
      setTimeout(() => {
        onMatchCard()
      }, TURN_TIMEOUT)
    } else {
      setTimeout(() => {
        state.currentOpened
          .forEach(cardEl => closeCard(cardEl))
        state.currentOpened = []
      }, TURN_TIMEOUT)
    }
  }
}

const getShuffledCards = cards => {
  const shuffledCards = [...cards]
  return shuffledCards.sort(() => Math.random() > 0.5 ? 1 : -1)
}

const generateRandomCards = () => {
  const cardElements = []
  const shuffledCards = getShuffledCards(CARDS).slice(0, CARDS_IN_GAME)
  const cardsInGame = getShuffledCards([...shuffledCards, ...shuffledCards]) //shuffle again

  let i=0
  while(i < cardsInGame.length) {
    const currentCard = cardsInGame[i]
    const cardElement = document.createElement('div')
    cardElement.classList.add('card')
    cardElement.setAttribute('id', currentCard)
    cardElement.addEventListener('click', onClickCard)

    const imageElement = document.createElement('img')
    imageElement.setAttribute('src', getImagePath(LOGO_IMAGE))
    imageElement.setAttribute('id', currentCard)
    imageElement.setAttribute('card-id', currentCard)

    cardElement.appendChild(imageElement)
    cardElements.push(cardElement)
    i++
  }

  return cardElements
}

const initialize = () => {
  const cards = generateRandomCards()
  cards.forEach(cardEl => container.appendChild(cardEl))
}

window.onload = function() {
  resetBtn.addEventListener('click', resetGame)
  initialize()
}