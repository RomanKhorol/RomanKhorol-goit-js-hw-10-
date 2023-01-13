import './css/styles.css';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
const DEBOUNCE_DELAY = 300;
const refs = {
  inputField: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  oneCountry: document.querySelector('.country-info'),
};
refs.inputField.addEventListener(
  'input',
  debounce(onInputChange, DEBOUNCE_DELAY)
);
function onInputChange(e) {
  let dataCounry = refs.inputField.value.trim();
  if (dataCounry === '') {
    refs.countryList.style.display = 'none';
    refs.oneCountry.style.display = 'none';
    return;
  }
  fetchCountries(dataCounry).then(renderCoutries);
}
function renderCoutries(countries) {
  console.log(countries.length);
  if (countries.length > 10) {
    refs.countryList.style.display = 'none';
    refs.oneCountry.style.display = 'none';
    refs.oneCountry.style.listStyleType = 'none';
    Notiflix.Notify.warning(
      `Too many matches found. Please enter a more specific name.`
    );
  } else if (countries.length > 1 && countries.length < 10) {
    refs.oneCountry.style.display = 'none';
    const countryItem = countries
      .map(country => {
        return `<li class="country-item"><img src=${country.flags.svg} alt=flag width = 60px /><p>${country.name.official}</p>
    
  </li>`;
      })
      .join('');
    refs.countryList.innerHTML = countryItem;
    refs.countryList.style.display = 'flex';
    refs.countryList.style.flexDirection = 'column';
    refs.countryList.style.marginTop = '0px';
    refs.countryList.style.paddingLeft = '0px';
    refs.countryList.style.gap = '5px';
  } else if (countries.length === 1) {
    refs.countryList.style.display = 'none';
    refs.oneCountry.style.display = 'flex';
    refs.oneCountry.style.listStyleType = 'none';
    const item = countries.map(country => {
      return `<li><p>${country.name.official}</p>
    <img src=${country.flags.svg} alt=flag width = 50px />
    <p>Capital: ${country.capital}</p>
    <p>Populations: ${country.population}</p>
    <p>Languages: ${Object.values(country.languages).join(', ')}</p>
  </li>`;
    });
    refs.oneCountry.innerHTML = item;
  } else {
    refs.countryList.style.display = 'none';
    refs.oneCountry.style.display = 'none';
    Notiflix.Notify.warning(`Oops, there is no country with that name`);
  }
}
