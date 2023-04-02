import { Notify } from 'notiflix';
import { PixabayAPI } from './js/pixabay-api';
import { createGalleryMarkup } from './js/create-gallery-markup';

const refs = {
  formEl: document.querySelector('.search-form'),
  inputEl: document.querySelector('.search-form input'),
  galleryEl: document.querySelector('.gallery'),
};

console.log(refs);

const pixabayAPI = new PixabayAPI();

const handleSubmit = async event => {
  event.preventDefault();

  const queryWord = refs.inputEl.value.trim();
  pixabayAPI.queryWord = queryWord;

  const { data } = await pixabayAPI.fetchPhotos();

  if (!data.hits.length) {
    Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  createGalleryMarkup(refs.galleryEl, data.hits);
};

refs.formEl.addEventListener('submit', handleSubmit);
