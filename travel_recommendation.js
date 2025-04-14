document.addEventListener("DOMContentLoaded", () => {
    let travelData = [];

    fetchTravelData();

    const searchButton = document.getElementById("search-button");
    if (searchButton) {
        searchButton.addEventListener("click", handleSearch);
    }

    const clearButton = document.getElementById("clear-button");
    if (clearButton) {
        clearButton.addEventListener("click", clearResults);
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
                travelData = data;
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                displayError("Failed to load travel recommendations.");
            });
    }

    function handleSearch() {
        const query = getSearchQuery();
        const resultLabel = document.getElementById("result-label");
        if (resultLabel) resultLabel.innerHTML = ""; // Clear previous results

        const filteredResults = filterRecommendations(query);
        displayResults(filteredResults);
    }

    function getSearchQuery() {
        const searchInput = document.getElementById("search-field");
        return searchInput ? searchInput.value.trim().toLowerCase() : "";
    }

    function filterRecommendations(query) {
        const categories = ["beach", "temple", "country"];
        if (categories.includes(query) || categories.some(cat => query === `${cat}s`)) {
            return travelData.filter(recommendation => matchesCategory(recommendation, query));
        }
        return travelData.filter(recommendation => matchesGeneralQuery(recommendation, query));
    }

    function matchesCategory(recommendation, query) {
        const name = recommendation.name ? recommendation.name.toLowerCase() : "";
        const description = recommendation.description ? recommendation.description.toLowerCase() : "";
        if (query === "beach" || query === "beaches") {
            return name.includes("beach") || description.includes("beach");
        }
        if (query === "temple" || query === "temples") {
            return name.includes("temple") || description.includes("temple");
        }
        if (query === "country" || query === "countries") {
            return name.includes("country") || description.includes("country");
        }
        return false;
    }

    function matchesGeneralQuery(recommendation, query) {
        const name = recommendation.name ? recommendation.name.toLowerCase() : "";
        const description = recommendation.description ? recommendation.description.toLowerCase() : "";
        return name.includes(query) || description.includes(query);
    }

    function displayResults(filteredResults) {
        const resultLabel = document.getElementById("result-label");
        if (!resultLabel) return;

        if (filteredResults.length > 0) {
            filteredResults.forEach(recommendation => {
                const recommendationDiv = createRecommendationElement(recommendation);
                resultLabel.appendChild(recommendationDiv);
            });
        } else {
            resultLabel.textContent = "No matching recommendations found.";
        }
    }

    function createRecommendationElement(recommendation) {
        const recommendationDiv = document.createElement("div");
        recommendationDiv.classList.add("recommendation");

        const nameEl = document.createElement("h2");
        nameEl.textContent = recommendation.name;
        recommendationDiv.appendChild(nameEl);

        const imgEl = document.createElement("img");
        imgEl.src = recommendation.imageUrl;
        imgEl.alt = recommendation.name;
        recommendationDiv.appendChild(imgEl);

        if (recommendation.description) {
            const descriptionEl = document.createElement("p");
            descriptionEl.textContent = recommendation.description;
            recommendationDiv.appendChild(descriptionEl);
        }

        return recommendationDiv;
    }

    function clearResults() {
        const resultLabel = document.getElementById("result-label");
        if (resultLabel) resultLabel.innerHTML = ""; // Clear the results section

        const searchField = document.getElementById("search-field");
        if (searchField) searchField.value = ""; // Clear the search field
    }

    function displayError(message) {
        const resultLabel = document.getElementById("result-label");
        if (resultLabel) resultLabel.textContent = message;
    }
});