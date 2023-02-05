import { debounce } from 'lodash';
import { alert } from '@pnotify/core';
import axios from 'axios';

import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

import './styles/index.scss';
import countriesListTemplate from './partials/countries-list.hbs';
import countryInfoTemplate from './partials/country-info.hbs';

const refs = {
  searchInput: document.querySelector('#searchInput'),
  resultElem: document.querySelector('#result'),
};

refs.searchInput.addEventListener(
  'input',
  debounce(() => {
    const query = refs.searchInput.value.trim();
    if (query === '') {
      return;
    }

    axios
      .get(`https://restcountries.com/v2/name/${query}`)
      .then((res) => {
        if (res.data.length > 10) {
          alert({
            text: 'Будьласка уточніть ваш запит',
          });
        } else if (res.data.length >= 2) {
          refs.resultElem.innerHTML = countriesListTemplate({
            countries: res.data,
          });
        } else {
          refs.resultElem.innerHTML = countryInfoTemplate(res.data[0]);
        }

        // if (res.data.length >= 2 && res.data.length <= 10) {
        //   console.log(res.data);
        // }

        // if (res.data.length === 1) {
        //   console.log(res.data[0]);
        // }
      })
      .catch((error) => {
        if (error.response.status === 404) {
          alert({
            text: 'Такої країни не знайдено. Спробуйте ще раз',
          });
        } else {
          alert({
            text: 'Невідома помилка. Спробуйте ще раз',
          });
        }
      });
  }, 500)
);
