// Sample quotes array (initial data can be loaded from localStorage if available)
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Motivation" },
    { text: "The best way to predict the future is to create it.", category: "Inspiration" }
];

// Initialize the app on page load
document.addEventListener("DOMContentLoaded", function() {
    loadQuotes(); // Load quotes from localStorage if available
    populateCategories();  // Populate the category dropdown on page load
    document.getElementById("addQuoteButton").addEventListener("click", addQuoteFromInput);
    document.getElementById("newQuote").addEventListener("click", showRandomQuote);
    document.getElementById("exportQuotesButton").addEventListener("click", exportToJsonFile);
    document.getElementById("importFile").addEventListener("change", importFromJsonFile);
});

// Populate categories dynamically from the quotes array
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    const uniqueCategories = new Set();

    // Extract unique categories from the quotes array
    quotes.forEach(quote => uniqueCategories.add(quote.category));

    // Clear existing options (except 'All Categories')
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    // Add the unique categories as options
    uniqueCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Restore last selected category from local storage
    const lastCategory = localStorage.getItem('selectedCategory') || 'all';
    categoryFilter.value = lastCategory;

    // Apply the filter based on the last selected category
    filterQuotes();
}

// Function to filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    const filteredQuotes = selectedCategory === 'all'
        ? quotes // Show all quotes if 'all' is selected
        : quotes.filter(quote => quote.category === selectedCategory);

    // Display filtered quotes (assuming displayQuotes is a function that updates the DOM)
    displayQuotes(filteredQuotes);

    // Save the selected category to local storage
    localStorage.setItem('selectedCategory', selectedCategory);
}

// Function to display quotes in the DOM
function displayQuotes(quotesToDisplay) {
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = ""; // Clear existing quotes

    quotesToDisplay.forEach(quote => {
        const quoteElement = document.createElement("div");
        quoteElement.textContent = `"${quote.text}" - ${quote.category}`;
        quoteDisplay.appendChild(quoteElement);
    });
}

// Function to add a new quote
function addQuote(text, category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories(); // Re-populate categories dropdown after adding a new quote
    alert('Quote added successfully!');
}

// Function to add a new quote from the input fields
function addQuoteFromInput() {
    const quoteText = document.getElementById("newQuoteText").value;
    const quoteCategory = document.getElementById("newQuoteCategory").value;

    if (quoteText && quoteCategory) {
        addQuote(quoteText, quoteCategory);
        document.getElementById("newQuoteText").value = ""; // Clear input fields
        document.getElementById("newQuoteCategory").value = "";
    } else {
        alert('Please fill in both fields!');
    }
}

// Function to display a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    alert(`"${randomQuote.text}" - ${randomQuote.category}`);
}

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to load quotes from local storage
function loadQuotes() {
    const savedQuotes = localStorage.getItem('quotes');
    if (savedQuotes) {
        quotes = JSON.parse(savedQuotes);
    }
}

// Function to export quotes to a JSON file
function exportToJsonFile() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "quotes.json";
    link.click();
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes); // Add imported quotes to the current array
        saveQuotes(); // Save to local storage
        populateCategories(); // Re-populate categories dropdown
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}
