import { createGalleryCards } from './gallery-markup';
import { PixabayAPI } from './pixabay-api';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  container: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const pixabayAPI = new PixabayAPI();
let gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
refs.loadMoreBtn.classList.add('is-hidden');

function onSearchFormSubmit(e) {
  e.preventDefault();

  pixabayAPI.page = 1;
  pixabayAPI.q = e.currentTarget.elements.searchQuery.value;

  pixabayAPI
    .fetchImageByQuery()
    .then(data => {
      if (data.hits.length === 0) {
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again'
        );
      }

      Notify.success(`Hooray! We found ${data.totalHits} images.`);
      refs.container.innerHTML = createGalleryCards(data.hits);
      gallery.refresh();
    })
    .catch(err => {
      console.log(err);
    });
  refs.loadMoreBtn.classList.remove('is-hidden');
}

function onLoadMoreBtnClick() {
  pixabayAPI.page += 1;

  pixabayAPI
    .fetchImageByQuery()
    .then(data => {
      if (data.hits.length === 0) {
        refs.loadMoreBtn.classList.add('is-hidden');
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        return;
      }

      refs.container.insertAdjacentHTML(
        'beforeend',
        createGalleryCards(data.hits)
      );
      gallery.refresh();
    })
    .catch(err => {
      console.log(err);
    });
}

refs.searchForm.addEventListener('submit', onSearchFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
