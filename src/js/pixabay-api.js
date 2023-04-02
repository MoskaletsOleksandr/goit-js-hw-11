'use strict';

import axios from 'axios';

export class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '34991983-4beab49a12e957ed3014e2d55';

  queryWord = null;
  page = 1;
  per_page = 40;

  loadedPhotos() {
    return this.page * this.per_page;
  }

  async fetchPhotos() {
    try {
      return await axios.get(
        `${this.#BASE_URL}/?key=${this.#API_KEY}&q=${
          this.queryWord
        }&image_type=photo&orientation=horizontal&safesearch=true&page=${
          this.page
        }&per_page=${this.per_page}`
      );
    } catch (error) {
      throw new Error(error);
    }
  }
}
