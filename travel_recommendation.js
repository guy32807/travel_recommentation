document.addEventListener("DOMContentLoaded", () => {
    let travelData = {};

    fetchTravelData();

    const searchForm = document.getElementById("searchForm");
    if (searchForm) {
        searchForm.addEventListener("submit", (event) => {
            event.preventDefault(); // Prevent form submission
            console.log("Search form submitted");
            handleSearch();
        });
    } else {
        console.error("Search form not found");
    }

    const clearButton = document.querySelector("button[type='reset']");
    if (clearButton) {
        clearButton.addEventListener("click", clearResults);
    } else {
        console.error("Clear button not found");
    }

    function fetchTravelData() {
        fetch('travel_recommendation_api.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                console.log("Fetched travel recommendations:", data);
                travelData = data; // Assign the fetched data
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                displayError("Failed to load travel recommendations.");
            });
    }

    function handleSearch() {
        const query = getSearchQuery();
        console.log("Search query:", query);

        const resultContainer = document.getElementById("result-label");
        if (resultContainer) resultContainer.innerHTML = ""; // Clear previous results

        const filteredResults = filterRecommendations(query);
        console.log("Filtered results:", filteredResults);

        displayResults(filteredResults);
    }

    function getSearchQuery() {
        const searchInput = document.getElementById("search-field");
        if (!searchInput) {
            console.error("Search input not found");
            return "";
        }
        return searchInput.value.trim().toLowerCase();
    }

    function filterRecommendations(query) {
        const categories = ["beach", "temple", "country"];
        let results = [];

        if (categories.includes(query) || categories.some(cat => query === `${cat}s`)) {
            if (query === "beach" || query === "beaches") {
                results = travelData.beaches || [];
            } else if (query === "temple" || query === "temples") {
                results = travelData.temples || [];
            } else if (query === "country" || query === "countries") {
                results = travelData.countries.flatMap(country => country.cities || []);
            }
        } else {
            // General search across all categories
            results = [
                ...(travelData.beaches || []),
                ...(travelData.temples || []),
                ...travelData.countries.flatMap(country => country.cities || [])
            ].filter(recommendation => matchesGeneralQuery(recommendation, query));
        }

        return results;
    }

    function matchesGeneralQuery(recommendation, query) {
        const name = recommendation.name ? recommendation.name.toLowerCase() : "";
        const description = recommendation.description ? recommendation.description.toLowerCase() : "";
        return name.includes(query) || description.includes(query);
    }

    function displayResults(filteredResults) {
        const resultContainer = document.getElementById("result-label");
        if (!resultContainer) {
            console.error("Result container not found");
            return;
        }

        if (filteredResults.length > 0) {
            filteredResults.forEach(recommendation => {
                const recommendationDiv = createRecommendationElement(recommendation);
                resultContainer.appendChild(recommendationDiv);
            });
        } else {
            resultContainer.textContent = "No matching recommendations found.";
        }
    }

    function createRecommendationElement(recommendation) {
        const recommendationDiv = document.createElement("div");
        recommendationDiv.classList.add("recommendation", "mt-4", "p-4", "bg-gray-800", "rounded");

        const nameEl = document.createElement("h3");
        nameEl.classList.add("text-green-300", "text-xl", "font-bold");
        nameEl.textContent = recommendation.name;
        recommendationDiv.appendChild(nameEl);

        const imgEl = document.createElement("img");
        imgEl.src = recommendation.imageUrl;
        imgEl.alt = recommendation.name;
        imgEl.classList.add("mt-2", "rounded");
        recommendationDiv.appendChild(imgEl);

        if (recommendation.description) {
            const descriptionEl = document.createElement("p");
            descriptionEl.classList.add("text-green-200", "mt-2");
            descriptionEl.textContent = recommendation.description;
            recommendationDiv.appendChild(descriptionEl);
        }

        return recommendationDiv;
    }

    function clearResults() {
        const resultContainer = document.getElementById("result-label");
        if (resultContainer) resultContainer.innerHTML = ""; // Clear the results section

        const searchField = document.getElementById("search-field");
        if (searchField) searchField.value = ""; // Clear the search field
    }

    function displayError(message) {
        const resultContainer = document.getElementById("result-label");
        if (resultContainer) resultContainer.textContent = message;
    }
});