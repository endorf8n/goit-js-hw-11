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
let gallery = new SimpleLightbox('.gallery a');

refs.loadMoreBtn.classList.add('is-hidden');

async function onSearchFormSubmit(e) {
  e.preventDefault();

  pixabayAPI.page = 1;
  pixabayAPI.q = e.currentTarget.elements.searchQuery.value;

  try {
    const data = await pixabayAPI.fetchImageByQuery();

    if (pixabayAPI.q === '') {
      return Notify.info(
        'Sorry, but the search field cannot be empty, please enter your query'
      );
    }

    if (data.totalHits === 0) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again'
      );
    }

    Notify.success(`Hooray! We found ${data.totalHits} images.`);
    refs.container.innerHTML = createGalleryCards(data.hits);
    gallery.refresh();
    refs.loadMoreBtn.classList.remove('is-hidden');
  } catch (err) {
    Notify.failure('Something went wrong. Please, try later.');
  }
}

async function onLoadMoreBtnClick() {
  pixabayAPI.page += 1;

  try {
    const data = await pixabayAPI.fetchImageByQuery();

    if (data.hits.length === 0) {
      refs.loadMoreBtn.classList.add('is-hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");
      return;
    }

    refs.container.insertAdjacentHTML(
      'beforeend',
      createGalleryCards(data.hits)
    );
    gallery.refresh();

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (err) {
    Notify.failure('Something went wrong. Please, try later.');
  }
}

refs.searchForm.addEventListener('submit', onSearchFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
