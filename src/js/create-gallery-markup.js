'use strict';

export const createGalleryMarkup = (DOMElement, photos) => {
  DOMElement.insertAdjacentHTML(
    'beforeend',
    photos
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => {
          return `<div class="photo-card">
        <a class="gallery__link link" href=${largeImageURL}>  
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="280"/>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
  </a>
</div>`;
        }
      )
      .join('')
  );
};
