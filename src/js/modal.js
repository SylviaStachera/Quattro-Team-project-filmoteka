import getFilmDescription from './getFilmDescription';
import renderFilmDescription from './renderFilmDescription';
import { addToWatched, addToQueue, isMovieInList, removeFromList } from "./localStorage";

const modalDOM = document.querySelector('.modal__window');

const qs = e => document.querySelector(e);

const closeBtn = qs('#modal__close');
const imageItem = qs('.movies__list');
const modal = qs('.modal');

const openModal = async e => {
  e.preventDefault();
  if (modal.classList.contains('is-hidden') === false) {
    return;
  }
  let movieId = 0;
  if (!e.target.closest('li')) {
    return;
  }
  modal.classList.remove('is-hidden');
  modal.classList.add('is-loading', 'modal__window--open');
  movieId = e.target.closest('li').dataset.id;
  try {
    const data = await getFilmDescription.getMovieDescription(movieId);
    modalDOM.insertAdjacentHTML('beforeend', renderFilmDescription.renderDescription(data));
    addModalButtonListeners(data);
  } catch (error) {
    console.log(error);
  } finally {
    modal.classList.remove('is-loading');
  }
};
const closeModal = () => {
  modal.classList.add('modal__window--close');
  setTimeout(() => {
    modal.classList.add('is-hidden');
    modal.classList.remove('modal__window--close');
    const modalImg = qs('.modal__image');
    const modalTextbox = qs('.modal__textbox');
    modalTextbox.remove();
    modalImg.remove();
  }, 1500);
};

closeBtn.addEventListener('click', closeModal);
imageItem.addEventListener('click', openModal);

const keydownListener = e => {
  if (e.key === 'Escape') {
    closeModal();
  }
};

const clickAway = e => {
  if (e.target.classList.contains('modal') && !e.target.classList.contains('modal__window')) {
    closeModal();
  }
};

const addModalButtonListeners = (movie) => {
  const addToWatchedBtn = qs("[data-btn='addToWatched']");
  const addToQueueBtn = qs("[data-btn='addToQueue']");

  const toggleMovieInList = (button, key, addedText, notAddedText) => {
    if (isMovieInList(key, movie.id)) {
      removeFromList(key, movie.id);
      button.textContent = notAddedText;
    } else {
      if (key === 'watched') {
        addToWatched(movie);
      } else {
        addToQueue(movie);
      }
      button.textContent = addedText;
    }
  };

  addToWatchedBtn.addEventListener("click", () => {
    toggleMovieInList(addToWatchedBtn, 'watched', 'ADDED TO WATCHED', 'ADD TO WATCHED');
  });

  addToQueueBtn.addEventListener("click", () => {
    toggleMovieInList(addToQueueBtn, 'queue', 'ADDED TO QUEUE', 'ADD TO QUEUE');
  });
};


document.addEventListener('keydown', keydownListener);
document.addEventListener('click', clickAway);
