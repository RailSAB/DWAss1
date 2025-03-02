document.addEventListener('DOMContentLoaded', () => {
    const filmContainer = document.getElementById('film-container');
    const sortSelect = document.getElementById('sort');
    const directorsSelect = document.getElementById('directors');
    const countriesSelect = document.getElementById('countries');
    const applyFiltersButton = document.getElementById('apply-filters');

    let filmsData = [];

    function displayFilms(films) {
        filmContainer.innerHTML = '';
        films.forEach(film => {
            const filmCard = document.createElement('div');
            filmCard.classList.add('film-card');
            filmCard.innerHTML = `
                <h2><a href="${film.link}" target="_blank">${film.title}</a></h2>
                <p><strong>Release Year:</strong> ${film.release_year}</p>
                <p><strong>Directors:</strong> ${film.directors.join(', ')}</p>
                <p><strong>Countries:</strong> ${film.countries.join(', ')}</p>
                <p><strong>Box Office:</strong> ${film.box_office}</p>
            `;
            filmContainer.appendChild(filmCard);
        });
    }

    function sortFilms(films, criteria) {
        const sortedFilms = [...films].sort((a, b) => {
            if (criteria.includes('release_year')) {
                return criteria === 'release_year_asc'
                    ? a.release_year - b.release_year
                    : b.release_year - a.release_year;
            } else if (criteria.includes('box_office')) {
                return criteria === 'box_office_asc'
                    ? a.num_val_box_office - b.num_val_box_office
                    : b.num_val_box_office - a.num_val_box_office;
            } else {
                return a.title.localeCompare(b.title);
            }
        });
        displayFilms(sortedFilms);
    }

    function filterFilms(films) {
        const selectedDirectors = Array.from(directorsSelect.selectedOptions).map(option => option.value);
        const selectedCountries = Array.from(countriesSelect.selectedOptions).map(option => option.value);

        return films.filter(film => {
            const directorsMatch = selectedDirectors.length === 0 || film.directors.some(director => selectedDirectors.includes(director));
            const countriesMatch = selectedCountries.length === 0 || film.countries.some(country => selectedCountries.includes(country));
            return directorsMatch && countriesMatch;
        });
    }

    function populateFilterOptions(films) {
        const directors = new Set();
        const countries = new Set();

        films.forEach(film => {
            film.directors.forEach(director => directors.add(director));
            film.countries.forEach(country => countries.add(country));
        });

        directorsSelect.innerHTML = '';
        directors.forEach(director => {
            const option = document.createElement('option');
            option.value = director;
            option.textContent = director;
            directorsSelect.appendChild(option);
        });

        countriesSelect.innerHTML = '';
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            countriesSelect.appendChild(option);
        });
    }

    fetch('films_data.json')
        .then(response => response.json())
        .then(data => {
            filmsData = data;
            displayFilms(filmsData);
            populateFilterOptions(filmsData);

            sortSelect.addEventListener('change', () => {
                const criteria = sortSelect.value;
                const filteredFilms = filterFilms(filmsData);
                sortFilms(filteredFilms, criteria);
            });

            applyFiltersButton.addEventListener('click', () => {
                const criteria = sortSelect.value;
                const filteredFilms = filterFilms(filmsData);
                sortFilms(filteredFilms, criteria);
            });
        })
});