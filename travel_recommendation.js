document.addEventListener("DOMContentLoaded", () => {
    let travelData = [];

    // Fetch JSON data from the API file
    fetch('travel_recommendation_api.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            console.log("Fetched travel recommendations:", data);
            travelData = data; // store data for later filtering
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            const resultLabel = document.getElementById("result-label");
            if (resultLabel) {
                resultLabel.textContent = "Failed to load travel recommendations.";
            }
        });

    // Add event listener for the search button click
    const searchButton = document.getElementById("search-button");
    if (searchButton) {
        searchButton.addEventListener("click", () => {
            const searchInput = document.getElementById("search-field");
            const queryRaw = searchInput ? searchInput.value.trim() : "";
            const query = queryRaw.toLowerCase();

            const resultLabel = document.getElementById("result-label");
            resultLabel.innerHTML = ""; // Clear previous results

            // Define the special keywords and their allowed variations
            const categories = ["beach", "temple", "country"];
            let filteredResults = [];
            
            if (categories.includes(query) || 
                categories.some(cat => query === `${cat}s`)) {
                // For category searches, check if the recommendation name or description contains the keyword.
                filteredResults = travelData.filter(recommendation => {
                    const name = recommendation.name ? recommendation.name.toLowerCase() : "";
                    const description = recommendation.description ? recommendation.description.toLowerCase() : "";
                    // Check for both singular and plural (e.g., "beach" and "beaches")
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
                });
            } else {
                // Default filtering for general searches
                filteredResults = travelData.filter(recommendation => {
                    const name = recommendation.name ? recommendation.name.toLowerCase() : "";
                    const description = recommendation.description ? recommendation.description.toLowerCase() : "";
                    return name.includes(query) || description.includes(query);
                });
            }

            // Display results
            if (filteredResults.length > 0) {
                filteredResults.forEach(recommendation => {
                    // Create a container for each recommendation
                    const recommendationDiv = document.createElement("div");
                    recommendationDiv.classList.add("recommendation");

                    // Display the name of the place
                    const nameEl = document.createElement("h2");
                    nameEl.textContent = recommendation.name;
                    recommendationDiv.appendChild(nameEl);

                    // Display the image (ensure that your imageUrl path is correct and points to your local assets)
                    const imgEl = document.createElement("img");
                    imgEl.src = recommendation.imageUrl;
                    imgEl.alt = recommendation.name;
                    recommendationDiv.appendChild(imgEl);

                    // Optionally display additional travel information
                    if (recommendation.description) {
                        const descriptionEl = document.createElement("p");
                        descriptionEl.textContent = recommendation.description;
                        recommendationDiv.appendChild(descriptionEl);
                    }

                    resultLabel.appendChild(recommendationDiv);
                });
            } else {
                resultLabel.textContent = "No matching recommendations found.";
            }
        });
    }

    // Add event listener for the clear button click
    const clearButton = document.getElementById("clear-button");
    if (clearButton) {
        clearButton.addEventListener("click", () => {
            const resultLabel = document.getElementById("result-label");
            if (resultLabel) {
                resultLabel.innerHTML = ""; // Clear the results section
            }
            const searchField = document.getElementById("search-field");
            if (searchField) {
                searchField.value = ""; // Optionally clear the search field
            }
        });
    }
});