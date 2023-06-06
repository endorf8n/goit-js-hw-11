import axios from 'axios';

export class PixabayAPI {
  static BASE_URL = 'https://pixabay.com/api/';
  static API_KEY = '36999899-ea6ffd3591d47a48690e5d95e';

  constructor() {
    this.page = null;
    this.q = null;
    this.per_page = 40;
  }

  async fetchImageByQuery() {
    const searchParams = new URLSearchParams({
      q: this.q,
      page: this.page,
      per_page: this.per_page,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      key: PixabayAPI.API_KEY,
    });

    const response = await axios.get(`${PixabayAPI.BASE_URL}?${searchParams}`);

    return response.data;
  }
}
