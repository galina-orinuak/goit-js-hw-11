import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchImages } from './fetchImg';

const searchForm = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more-button');
const gallery = document.querySelector('.gallery');

searchForm.addEventListener('submit', handlerSubmit);
loadMoreBtn.addEventListener('click', loadMoreClick);

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});


let queryToFetch = '';
let pageToFetch;


function handlerSubmit(evt) {
  evt.preventDefault();
  const query = evt.currentTarget.elements.searchQuery.value;
  
  if (!query.trim() || query === queryToFetch) {
    return;
  }
  queryToFetch = query;
  gallery.innerHTML = '';
  pageToFetch = 1;
  loadMoreBtn.classList.add('hidden');
  getImages(queryToFetch, pageToFetch);
  searchForm.reset();
}

const getImages = async (query, pageToFetch) => {
  try {
    const data = await fetchImages(query, pageToFetch);
    if (!data.hits.length) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    renderImages(data);
    lightbox.refresh();

    if (pageToFetch === 1) {
      
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }

    if (data.totalHits >= pageToFetch * pageLimit) {
      loadMoreBtn.classList.remove('hidden');
    }

    if (data.totalHits <= pageToFetch * pageLimit) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results"
      );
    }
  } catch (error) {
    console.log(error);
    // Notiflix.Notify.failure('Oops! Something went wrong!');
  }
};

const renderImages = data => {
  const markup = data.hits
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
        return `<a class="photo-link" href="${largeImageURL}"><div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes }
    </p>
    <p class="info-item">
      <b>Views</b>${views} 
    </p>
    <p class="info-item">
      <b>Comments</b>${comments }
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads }
    </p>
  </div>
</div></a>`;
      }
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
};




function loadMoreClick(){
  loadMoreBtn.classList.add('hidden');
  pageToFetch += 1;
  getImages(queryToFetch, pageToFetch);
}
