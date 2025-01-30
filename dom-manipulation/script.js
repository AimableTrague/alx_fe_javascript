let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Motivation" },
    { text: "The best way to predict the future is to create it.", category: "Inspiration" }
];

const API_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API for simulation

document.addEventListener("DOMContentLoaded", function() {
    loadQuotes();
    populateCategories();
    setInterval(syncQuotes, 5000); // Sync every 5 seconds
    document.getElementById("addQuoteButton").addEventListener("click", addQuoteFromInput);
    document.getElementById("newQuote").addEventListener("click", showRandomQuote);
});

function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");

    // Extract categories using map and filter out duplicates using Set
    const categories = [...new Set(quotes.map(quote => quote.category))];

    // Clear existing options (except 'All Categories')
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    // Add the unique categories as options
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    filterQuotes();
}

function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    const filteredQuotes = selectedCategory === 'all'
        ? quotes
        : quotes.filter(quote => quote.category === selectedCategory);

    displayQuotes(filteredQuotes);
}

function displayQuotes(quotesToDisplay) {
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = "";

    quotesToDisplay.forEach(quote => {
        const quoteElement = document.createElement("div");
        quoteElement.textContent = `"${quote.text}" - ${quote.category}`;
        quoteDisplay.appendChild(quoteElement);
    });
}

function addQuote(text, category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    alert('Quote added successfully!');
}

function addQuoteFromInput() {
    const quoteText = document.getElementById("newQuoteText").value;
    const quoteCategory = document.getElementById("newQuoteCategory").value;

    if (quoteText && quoteCategory) {
        addQuote(quoteText, quoteCategory);
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
    } else {
        alert('Please fill in both fields!');
    }
}

function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    alert(`"${randomQuote.text}" - ${randomQuote.category}`);
}

function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

function loadQuotes() {
    const savedQuotes = localStorage.getItem('quotes');
    if (savedQuotes) {
        quotes = JSON.parse(savedQuotes);
    }
}

async function fetchQuotesFromServer() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // Simulate server-side quotes (taking the first few posts as "quotes")
        return data.slice(0, quotes.length).map(post => ({
            text: post.title,
            category: post.body.split(" ")[0] // Simplified category based on post content
        }));
    } catch (error) {
        console.error("Failed to fetch quotes from the server:", error);
        return [];
    }
}

async function postQuoteToServer(quote) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(quote)
        });

        const data = await response.json();
        console.log("Quote posted successfully:", data);
        return data;
    } catch (error) {
        console.error("Failed to post quote to the server:", error);
    }
}

async function syncQuotes() {
    // Fetch the latest quotes from the server
    const serverQuotes = await fetchQuotesFromServer();

    if (serverQuotes.length === 0) return;

    let conflictsResolved = false;

    // Handle conflicts: If server data differs, replace with server data
    serverQuotes.forEach((serverQuote, index) => {
        if (JSON.stringify(quotes[index]) !== JSON.stringify(serverQuote)) {
            quotes[index] = serverQuote; // Override with server data
            conflictsResolved = true;
        }
    });

    if (conflictsResolved) {
        // Notify user about the conflict resolution
        alert("Data conflict resolved: Quotes updated from server.");
    }

    // Sync local storage and refresh the quotes display
    saveQuotes();
    populateCategories();
}

function exportToJsonFile() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "quotes.json";
    link.click();
}

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}
