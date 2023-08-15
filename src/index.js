import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchInfo, getMore } from './js/api-service.js';
import { createMarkup } from './js/markup';

const refs = {
  form: document.querySelector('#search-form'),
  wrapperGalery: document.querySelector('.gallery'),
  buttonMore: document.querySelector('.load-more'),
};

refs.buttonMore.classList.add('is-hidden');

let gallery = new SimpleLightbox('.gallery a');

refs.form.addEventListener('submit', onClickSubmitBtn);
refs.wrapperGalery.addEventListener('click', onClickGellaryItem);
refs.buttonMore.addEventListener('click', onClickBtnMore);

let searchThis;

function onClickSubmitBtn(evt) {
  evt.preventDefault();

  searchThis = evt.currentTarget.elements.searchQuery.value;

  fetchInfo(searchThis)
    .then(data => {
      refs.wrapperGalery.innerHTML = '';

      if (data.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        refs.form.children[0].value = ' ';
        return;
      }

      if (data.totalHits < 40) {
        renderMarkup(createMarkup(data.hits));
        Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
        setTimeout(() => {
          Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
        }, 1500);
        return;
      }

      renderMarkup(createMarkup(data.hits));

      refs.buttonMore.classList.remove('is-hidden');
    })
    .catch(er => console.warn(er))
    .finally(() => {
      gallery.refresh();
    });
}

function onClickBtnMore() {
  getMore(searchThis)
    .then(data => {
      if (data.hits.length < 40) {
        renderMarkup(createMarkup(data.hits));
        Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
        setTimeout(() => {
          Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
        }, 1500);

        refs.buttonMore.classList.add('is-hidden');
        return;
      }
      renderMarkup(createMarkup(data.hits));
    })
    .catch(er => console.warn(er))
    .finally(() => {
      gallery.refresh();
    });
}

function renderMarkup(markup) {
  refs.wrapperGalery.insertAdjacentHTML('beforeend', markup);
}

function onClickGellaryItem(evt) {
  evt.preventDefault();
}
