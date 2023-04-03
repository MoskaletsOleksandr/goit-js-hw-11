import { Notify } from 'notiflix';
import { PixabayAPI } from './js/pixabay-api';
import { createGalleryMarkup } from './js/create-gallery-markup';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import simpleLightbox from 'simplelightbox';

const refs = {
  formEl: document.querySelector('.search-form'),
  inputEl: document.querySelector('.search-form input'),
  galleryEl: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const pixabayAPI = new PixabayAPI();

const hideLoadMoreBtn = () => {
  refs.loadMoreBtn.classList.add('is-hidden');
};
const showLoadMoreBtn = () => {
  refs.loadMoreBtn.classList.remove('is-hidden');
};

const handleFormSubmit = async event => {
  event.preventDefault();
  hideLoadMoreBtn();
  refs.galleryEl.innerHTML = '';

  const queryWord = refs.inputEl.value.trim();

  pixabayAPI.queryWord = queryWord;
  pixabayAPI.page = 1;

  try {
    const { data } = await pixabayAPI.fetchPhotos();

    if (!data.hits.length || !queryWord) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    Notify.success(`Hooray! We found ${data.totalHits} images.`);

    createGalleryMarkup(refs.galleryEl, data.hits);

    if (data.totalHits >= pixabayAPI.loadedPhotos()) {
      showLoadMoreBtn();
    }
  } catch (error) {
    console.log(error);
  }
};

refs.formEl.addEventListener('submit', handleFormSubmit);

const handleLoadMoreBtnClick = async () => {
  pixabayAPI.page += 1;

  try {
    const { data } = await pixabayAPI.fetchPhotos();

    if (data.totalHits <= pixabayAPI.loadedPhotos()) {
      hideLoadMoreBtn();
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }

    createGalleryMarkup(refs.galleryEl, data.hits);
  } catch (error) {
    console.log(error);
  }
};

refs.loadMoreBtn.addEventListener('click', handleLoadMoreBtnClick);

const handleGalleryItemClick = event => {
  event.preventDefault();

  if (event.target.nodeName !== 'IMG') {
    return;
  }

  const lightbox = new simpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionsDelay: 250,
  });
};

refs.galleryEl.addEventListener('click', handleGalleryItemClick);
