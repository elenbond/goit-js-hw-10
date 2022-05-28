import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';

const inputCountryName = document.querySelector("#search-box");
const countryList = document.querySelector(".country-list");
const countryInfo = document.querySelector(".country-info");

const DEBOUNCE_DELAY = 300;

const clearPreviousResult = () => {
    countryList.innerHTML = "";
    countryInfo.innerHTML = "";
}

const renderCountryList = (countriesList) => {
    clearPreviousResult();
    const markup = countriesList
        .map(({ flags, name }) => 
            `<li class = "country-item">
            <span>
            <img class = "country-flag" src = "${flags.svg}" 
            alt = "Flag of ${name.official}" width = "50"/>
            ${name.official}
            </span>
            </li>`)
        .join("");
    countryList.insertAdjacentHTML("beforeend", markup);
    // countryList.innerHTML = markup;
}

const renderCountryCard = (countryCard) => {
    clearPreviousResult();
    const markup = countryCard
        .map(({ flags, name, capital, population, languages }) => 
            `<div class = "country-card">
            <h1>
            <img class = "country-flag" src = "${flags.svg}"
            alt = "Flag of ${name.official}" width = "50"/>${name.official}
            </h1>
            <p><span class = "country-data">Capital: </span>${capital}</p>
            <p><span class = "country-data">Population: </span>${population}</p>
            <p><span class = "country-data">Languages: </span>${Object.values(languages).join(", ")}</p>
            </div>`)
        .join("");
    countryInfo.insertAdjacentHTML("beforeend", markup);
    // countryInfo.innerHTML = markup;
}

const searchCountry = (country) => {
    if (country.length > 10) {
        Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
        // return;
    }  if (country.length >= 2 && country.length <= 10) {
        renderCountryList(country);
        // return;
    }  if(country.length === 1) {
        renderCountryCard(country);
        // return;
    }
}

const inputSearch = (event) => {
    clearPreviousResult();
    const inputValue = event.target.value.trim();
    if (inputValue === '') {
        return;
    }
    fetchCountries(inputValue)
        .then(searchCountry)
        .catch(error => {
            Notiflix.Notify.failure("Oops, there is no country with that name")
        })
}

inputCountryName.addEventListener('input', debounce(inputSearch, DEBOUNCE_DELAY));