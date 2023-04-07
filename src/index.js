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
  targetEl: document.querySelector('.target-element'),
};

const pixabayAPI = new PixabayAPI();

const handleFormSubmit = async event => {
  event.preventDefault();
  refs.galleryEl.innerHTML = '';

  const queryWord = refs.inputEl.value.trim().split(' ').join('+');

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
  } catch (error) {
    console.log(error);
  }
};

const onEntry = entries => {
  entries.forEach(async entry => {
    if (
      entry.isIntersecting &&
      pixabayAPI.queryWord !== '' &&
      refs.galleryEl.childElementCount !== 0
    ) {
      console.log(entry);

      pixabayAPI.page += 1;

      try {
        const { data } = await pixabayAPI.fetchPhotos();
        createGalleryMarkup(refs.galleryEl, data.hits);

        if (data.totalHits <= pixabayAPI.loadedPhotos()) {
          Notify.failure(
            "We're sorry, but you've reached the end of search results."
          );
          observer.unobserve(entry);
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
};

const options = {
  rootMargin: '200px',
};

let observer = new IntersectionObserver(onEntry, options);

observer.observe(refs.targetEl);

refs.formEl.addEventListener('submit', handleFormSubmit);

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
