document.addEventListener('DOMContentLoaded', function() {
    const addquote = document.getElementById('newQuoteText');
    const addCat = document.getElementById('newQuoteCategory');
    const randomQuote = document.getElementById('newQuote');
    const quoteDisplay = document.getElementById('quoteDisplay');
    const categorySelect = document.getElementById('quotes-category');
    const importFileInput = document.getElementById('importFile');
    const exportButton = document.getElementById('exportButton');

    // Load quotes from localStorage, or initialize with defaults
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [
        // (Initialize with default quotes here)
    ];

    // Save quotes to localStorage
    function saveQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
    }

    // Check if quotes array exists and has the required structure
    if (!Array.isArray(quotes) || !quotes.every(q => q.text && q.category)) {
        console.error('Invalid quotes data structure');
        return;
    }

    // Function to display a random quote
    function showRandomQuote() {
        quoteDisplay.innerHTML = '';  // Clear previous quote
        const filteredQuotes = categorySelect.value === "All" 
            ? quotes 
            : quotes.filter(q => q.category === categorySelect.value);

        if (filteredQuotes.length === 0) {
            quoteDisplay.textContent = "No quotes available in this category.";
            return;
        }

        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const quoteText = document.createElement('p');
        quoteText.textContent = filteredQuotes[randomIndex].text;
        quoteDisplay.appendChild(quoteText);

        // Store the last viewed quote in sessionStorage (Optional)
        sessionStorage.setItem("lastViewedQuote", JSON.stringify(filteredQuotes[randomIndex]));
    }

    // Function to add a new quote
    function addQuote() {
        const quote = addquote.value.trim();
        const category = addCat.value.trim();
        
        if (!quote || !category) {
            alert('Please enter a quote and a category.');
            return;
        }

        const newQuote = { text: quote, category };
        quotes.push(newQuote);
        saveQuotes();

        // Check if the category exists in the dropdown, if not add it
        const existingOption = Array.from(categorySelect.options).find(option => option.value === category);
        if (!existingOption) {
            const newCategoryOption = document.createElement('option');
            newCategoryOption.value = category;
            newCategoryOption.textContent = category;
            categorySelect.appendChild(newCategoryOption);
        }

        addquote.value = '';
        addCat.value = '';
        alert('Quote added successfully!');
    }

    // Event listener for adding a new quote
    const addit = document.querySelector('button');
    if (addit) {
        addit.addEventListener('click', addQuote);
    } else {
        console.error('Add Quote button not found');
    }

    // Event listener for showing a random quote
    randomQuote.addEventListener("click", showRandomQuote);

    // Import quotes from a JSON file
    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            const importedQuotes = JSON.parse(event.target.result);
            quotes.push(...importedQuotes);
            saveQuotes();
            alert('Quotes imported successfully!');
        };
        fileReader.readAsText(event.target.files[0]);
    }

    // Event listener for the import button
    importFileInput.addEventListener("change", importFromJsonFile);

    // Export quotes to a JSON file
    function exportToJsonFile() {
        const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = "quotes.json";
        link.click();
        URL.revokeObjectURL(url);
    }

    // Event listener for the export button
    exportButton.addEventListener("click", exportToJsonFile);
});
