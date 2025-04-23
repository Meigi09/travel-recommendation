document.addEventListener('DOMContentLoaded', function() {
    // Navigation elements
    const homeLink = document.querySelector('nav a[href=""]');
    const aboutLink = document.querySelector('nav a[href="about_us"]');
    const contactLink = document.querySelector('nav a[href="contact_us"]');

    // Content sections
    const heroSection = document.querySelector('.hero');
    const searchResultsSection = document.querySelector('.search-results');
    let resultsContainer = document.querySelector('.results');

    // Search elements
    const btnSearch = document.getElementById('search');
    const btnClear = document.getElementById('clear');
    const searchInput = document.getElementById('query');

    // Data stores
    let countriesData = [];
    let beachesData = [];
    let templesData = [];

    // Save original content
    const originalHeroContent = heroSection.innerHTML;
    const originalSearchResultsContent = searchResultsSection.innerHTML;

    // Initialize
    fetchData();
    setupEventListeners();

    function setupEventListeners() {
        // Navigation events
        homeLink?.addEventListener('click', (e) => {
            e.preventDefault();
            loadHomePage();
        });

        aboutLink?.addEventListener('click', (e) => {
            e.preventDefault();
            loadAboutPage();
        });

        contactLink?.addEventListener('click', (e) => {
            e.preventDefault();
            loadContactPage();
        });

        // Search events
        btnSearch?.addEventListener('click', handleSearch);
        btnClear?.addEventListener('click', clearSearch);
        searchInput?.addEventListener('input', searchItems);
    }

    function fetchData() {
        axios.get('travel_recommendation_api.json')
            .then(response => {
                const data = response.data;
                countriesData = data.countries || [];
                beachesData = data.beaches || [];
                templesData = data.temples || [];
                displayAllData();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                displayError('Failed to load data. Please try again later.');
            });
    }

    function loadHomePage() {
        heroSection.innerHTML = originalHeroContent;
        searchResultsSection.innerHTML = originalSearchResultsContent;
        searchResultsSection.style.display = 'block';
        resultsContainer = document.querySelector('.results'); // Reinitialize after content reset
        displayAllData();
    }

    function loadAboutPage() {
        heroSection.innerHTML = `
            <h1>About Us</h1>
            <section>
                <h2>Our Mission</h2>
                <p>We aim to provide the best travel recommendations to help you explore the world.</p>
            </section>
            <section>
                <h2>Our Team</h2>
                <p>We are a group of travel enthusiasts dedicated to sharing our experiences and tips.</p>
            </section>
        `;
        searchResultsSection.style.display = 'none';
    }

    function loadContactPage() {
        heroSection.innerHTML = `
            <h1>Contact Us</h1>
            <p>Have questions or suggestions? Reach out to us!</p>
        `;
        searchResultsSection.innerHTML = `
            <div class="results">
                <form>
                <div class="form-display">
                    <div class="form-group">
                        <label for="name">Name</label> <br>
                        <input type="text" id="name" name="name" placeholder="Enter your name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label><br>
                        <input type="email" id="email" name="email" placeholder="Enter your email" required>
                    </div>
                    <div class="form-group">
                        <label for="message">Message</label><br>
                        <textarea id="message" name="message" rows="5" placeholder="Enter your message" required></textarea>
                    </div>
                    <button type="submit">Send Message</button>
                    </div>
                </form>
            </div>
        `;
        searchResultsSection.style.display = 'block';
        resultsContainer = document.querySelector('.results'); // Reinitialize after content change
    }

    function handleSearch() {
        const query = searchInput.value.trim();
        if (query === '') {
            displayAllData();
        } else {
            searchItems();
        }
        searchResultsSection.style.display = 'block';
    }

    function clearSearch() {
        searchInput.value = '';
        displayAllData();
    }

    function searchItems() {
        const query = searchInput.value.toLowerCase().trim();

        if (query === '') {
            displayAllData();
            return;
        }

        const filteredCountries = countriesData.filter(item =>
            item.name.toLowerCase().includes(query) ||
            (item.cities && item.cities.some(city =>
                    city.name.toLowerCase().includes(query) ||
                    city.description.toLowerCase().includes(query)
                )
            ));

        const filteredBeaches = beachesData.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
        );

        const filteredTemples = templesData.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
        );

        resultsContainer.innerHTML = '';

        if (filteredCountries.length > 0) displayCountriesData(filteredCountries);
        if (filteredBeaches.length > 0) displayBeachesData(filteredBeaches);
        if (filteredTemples.length > 0) displayTempleData(filteredTemples);

        if (filteredCountries.length === 0 && filteredBeaches.length === 0 && filteredTemples.length === 0) {
            resultsContainer.innerHTML = '<p>No items found matching your search.</p>';
        }
    }

    function displayAllData() {
        if (!resultsContainer) return;
        resultsContainer.innerHTML = '';
        if (countriesData.length > 0) displayCountriesData(countriesData);
        if (beachesData.length > 0) displayBeachesData(beachesData);
        if (templesData.length > 0) displayTempleData(templesData);
    }

    function displayError(message) {
        if (resultsContainer) {
            resultsContainer.innerHTML = `<p class="error">${message}</p>`;
        }
    }

    function displayCountriesData(countries) {
        const section = document.createElement('div');
        section.className = 'section countries-section';
        section.innerHTML = '<h1>Countries</h1>';

        countries.forEach(country => {
            const countryElement = document.createElement('div');
            countryElement.className = 'result-item';
            countryElement.innerHTML = `<h3>${country.name}</h3>`;

            if (country.cities?.length > 0) {
                const citiesContainer = document.createElement('div');
                citiesContainer.className = 'cities-container';
                citiesContainer.innerHTML = '<h4>Cities:</h4>';

                country.cities.forEach(city => {
                    const cityElement = document.createElement('div');
                    cityElement.className = 'city-item';
                    cityElement.innerHTML = `
                        ${city.imageUrl ? `<img src="${city.imageUrl}" alt="${city.name}" class="city-image">
                        <h4>${city.name}</h4>
                        <p>${city.description}</p>
                        <button>Visit</button>
                        ` : ''}
                    `;
                    citiesContainer.appendChild(cityElement);
                });

                countryElement.appendChild(citiesContainer);
            }

            section.appendChild(countryElement);
        });

        resultsContainer.appendChild(section);
    }

    function displayBeachesData(beaches) {
        const section = document.createElement('div');
        section.className = 'section beaches-section';
        section.innerHTML = '<h1>Beaches</h1>';

        beaches.forEach(beach => {
            const beachElement = document.createElement('div');
            beachElement.className = 'result-item';
            beachElement.innerHTML = `
                ${beach.imageUrl ? `<img src="${beach.imageUrl}" alt="${beach.name}" class="beach-image">
                <h3>${beach.name}</h3>
                <p>${beach.description}</p>
                ` : ''}
            `;
            section.appendChild(beachElement);
        });

        resultsContainer.appendChild(section);
    }

    function displayTempleData(temples) {
        const section = document.createElement('div');
        section.className = 'section temples-section';
        section.innerHTML = '<h1>Temples</h1>';

        temples.forEach(temple => {
            const templeElement = document.createElement('div');
            templeElement.className = 'result-item';
            templeElement.innerHTML = `
                ${temple.imageUrl ? `<img src="${temple.imageUrl}" alt="${temple.name}" class="temple-image">
                <h3>${temple.name}</h3>
                <p>${temple.description}</p>
                ` : ''}
            `;
            section.appendChild(templeElement);
        });

        resultsContainer.appendChild(section);
    }
});