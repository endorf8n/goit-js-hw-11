export class PixabayAPI {
  static BASE_URL = 'https://pixabay.com/api/';
  static API_KEY = '36999899-ea6ffd3591d47a48690e5d95e';

  constructor() {
    this.page = null;
    this.q = null;
  }

  fetchImageByQuery() {
    const searchParams = new URLSearchParams({
      q: this.q,
      page: this.page,
      per_page: 8,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      key: PixabayAPI.API_KEY,
    });

    return fetch(`${PixabayAPI.BASE_URL}?${searchParams}`).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }

      return response.json();
    });
  }
}
