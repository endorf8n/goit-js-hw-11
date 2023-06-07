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
  pixabayAPI.q = e.currentTarget.elements.searchQuery.value.trim();

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
    if (data.totalHits <= pixabayAPI.per_page) {
      refs.loadMoreBtn.classList.add('is-hidden');
      return;
    }

    refs.loadMoreBtn.classList.remove('is-hidden');
  } catch (err) {
    Notify.failure('Something went wrong. Please, try later.');
  }
}

async function onLoadMoreBtnClick() {
  pixabayAPI.page += 1;

  try {
    const data = await pixabayAPI.fetchImageByQuery();

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

    if (data.totalHits < pixabayAPI.page * pixabayAPI.per_page) {
      refs.loadMoreBtn.classList.add('is-hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");
      return;
    }
  } catch (err) {
    Notify.failure('Something went wrong. Please, try later.');
  }
}

refs.searchForm.addEventListener('submit', onSearchFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
// const observerdEl = document.querySelector('.js-observerd-element');

// const galleryObserver = new IntersectionObserver(
//   async (entries, observer) => {
//     if (entries[0].isIntersecting) {
//       pixabayAPI.page += 1;

//       try {
//         const data = await pixabayAPI.fetchImageByQuery();

//         refs.container.insertAdjacentHTML(
//           'beforeend',
//           createGalleryCards(data.hits)
//         );
//         gallery.refresh();

//         if (pixabayAPI.page === data.totalHits.length - 1) {
//           observer.unobserve(observerdEl);
//         }

//         if (data.totalHits < pixabayAPI.page * pixabayAPI.per_page) {
//           Notify.info(
//             "We're sorry, but you've reached the end of search results."
//           );
//           return;
//         }
//       } catch (err) {
//         Notify.failure('Something went wrong. Please, try later.');
//       }
//     }
//   },
//   {
//     root: null,
//     rootMargin: '0px 0px 400px 0px',
//     threshold: 1.0,
//   }
// );

// async function onSearchFormSubmit(e) {
//   e.preventDefault();

//   pixabayAPI.page = 1;
//   pixabayAPI.q = e.currentTarget.elements.searchQuery.value.trim();

//   try {
//     const data = await pixabayAPI.fetchImageByQuery();

//     if (pixabayAPI.q === '') {
//       return Notify.info(
//         'Sorry, but the search field cannot be empty, please enter your query'
//       );
//     }

//     if (data.totalHits === 0) {
//       return Notify.failure(
//         'Sorry, there are no images matching your search query. Please try again'
//       );
//     }
//     if (data.totalHits > pixabayAPI.per_page) {
//       setTimeout(() => {
//         galleryObserver.observe(observerdEl);
//       }, 1000);
//     }
//     Notify.success(`Hooray! We found ${data.totalHits} images.`);
//     refs.container.innerHTML = createGalleryCards(data.hits);
//     gallery.refresh();
//   } catch (err) {
//     Notify.failure('Something went wrong. Please, try later.');
//   }
// }

// refs.searchForm.addEventListener('submit', onSearchFormSubmit);
