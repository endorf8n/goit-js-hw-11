import { createGalleryCards } from './gallery-markup';
import { PixabayAPI } from './pixabay-api';

const refs = {
  searchForm: document.querySelector('.search-form'),
  container: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const pixabayAPI = new PixabayAPI();

console.log(pixabayAPI);

function onSearchFormSubmit(e) {
  e.preventDefault();

  pixabayAPI.page = 1;
  pixabayAPI.q = e.currentTarget.elements.searchQuery.value;

  pixabayAPI
    .fetchImageByQuery()
    .then(data => {
      refs.container.innerHTML = createGalleryCards(data.hits);
    })
    .catch(err => {
      console.log(err);
    });
}

refs.searchForm.addEventListener('submit', onSearchFormSubmit);
