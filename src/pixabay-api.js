export class PixabayAPI {
  static BASE_URL = 'https://pixabay.com/api/';
  static API_KEY = '36999899-ea6ffd3591d47a48690e5d95e';

  constructor() {
    this.page = null;
    this.q = null;
  }

  async fetchImageByQuery() {
    const searchParams = new URLSearchParams({
      q: this.q,
      page: this.page,
      per_page: 8,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      key: PixabayAPI.API_KEY,
    });

    const response = await fetch(`${PixabayAPI.BASE_URL}?${searchParams}`);
    if (!response.ok) {
      throw new Error(response.status);
    }
    const data = await response.json();
    return data;
  }
}
