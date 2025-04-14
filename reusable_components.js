function loadNavigation() {
    const navigationHTML = `
        <nav class="bg-green-900 bg-opacity-80 shadow p-4">
            <div class="container mx-auto flex items-center justify-between">
                <a class="text-2xl font-mono font-bold text-green-300" href="index.html">Otherworldly Journeys</a>
                <ul class="flex space-x-4">
                    <li><a class="text-green-200 hover:text-green-400" href="index.html">Home</a></li>
                    <li><a class="text-green-200 hover:text-green-400" href="about_us.html">About Us</a></li>
                    <li><a class="text-green-200 hover:text-green-400" href="contact_us.html">Contact Us</a></li>
                </ul>
                <form id="searchForm" class="flex space-x-2">
                    <input type="text" id="search-field" class="p-2 border border-green-600 rounded bg-gray-800 text-green-200" placeholder="Search mystical portals...">
                    <button id="search-button" type="submit" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Search</button>
                    <button type="reset" class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Reset</button>
                </form>
            </div>
        </nav>
    `;
    document.getElementById("navigation").innerHTML = navigationHTML;
}

function applySEO({ title, description, keywords, url, image }) {
    // Set the title tag
    const titleTag = document.createElement("title");
    titleTag.textContent = title;
    document.head.appendChild(titleTag);

    // Add meta tags
    const metaTags = [
        { name: "description", content: description },
        { name: "keywords", content: keywords },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: image },
        { property: "twitter:card", content: "summary_large_image" },
        { property: "twitter:url", content: url },
        { property: "twitter:title", content: title },
        { property: "twitter:description", content: description },
        { property: "twitter:image", content: image }
    ];

    metaTags.forEach(tag => {
        const meta = document.createElement("meta");
        Object.keys(tag).forEach(attr => meta.setAttribute(attr, tag[attr]));
        document.head.appendChild(meta);
    });
}
