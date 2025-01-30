document.addEventListener('DOMContentLoaded', function() {
    const addquote = document.getElementById('newQuoteText');
    const addCat = document.getElementById('newQuoteCategory');
    const randomQuote = document.getElementById('newQuote');
    const quoteDisplay = document.getElementById('quoteDisplay');
    const categorySelect = document.getElementById('quotes-category');

    let quotes = JSON.parse(localStorage.getItem("quotes")) || [
        { text: "The only way to do great work is to love what you do.", category: "Motivation" },
        { text: "Don't watch the clock; do what it does. Keep going.", category: "Motivation" },
        { text: "Opportunities don't happen. You create them.", category: "Motivation" },
        { text: "Act as if what you do makes a difference. It does.", category: "Motivation" },
        { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
        { text: "Keep your face always toward the sunshine—and shadows will fall behind you.", category: "Inspiration" },
        { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", category: "Inspiration" },
        { text: "No matter what people tell you, words and ideas can change the world.", category: "Inspiration" },
        { text: "Do what you can, with what you have, where you are.", category: "Success" },
        { text: "Success usually comes to those who are too busy to be looking for it.", category: "Success" },
        { text: "Don't be afraid to give up the good to go for the great.", category: "Success" },
        { text: "The road to success and the road to failure are almost exactly the same.", category: "Success" },
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Perseverance" },
        { text: "It always seems impossible until it's done.", category: "Perseverance" },
        { text: "Perseverance is not a long race; it is many short races one after the other.", category: "Perseverance" },
        { text: "Hardships often prepare ordinary people for an extraordinary destiny.", category: "Perseverance" },
        { text: "Happiness depends upon ourselves.", category: "Happiness" },
        { text: "The purpose of our lives is to be happy.", category: "Happiness" },
        { text: "Happiness is not something ready made. It comes from your own actions.", category: "Happiness" },
        { text: "Count your age by friends, not years. Count your life by smiles, not tears.", category: "Happiness" },
        { text: "A journey of a thousand miles begins with a single step.", category: "Wisdom" },
        { text: "Knowing yourself is the beginning of all wisdom.", category: "Wisdom" },
        { text: "The only true wisdom is in knowing you know nothing.", category: "Wisdom" },
        { text: "Turn your wounds into wisdom.", category: "Wisdom" },
        { text: "Believe you can and you’re halfway there.", category: "Confidence" },
        { text: "With confidence, you have won before you have started.", category: "Confidence" },
        { text: "Confidence comes not from always being right, but from not fearing to be wrong.", category: "Confidence" },
        { text: "No one can make you feel inferior without your consent.", category: "Confidence" },
        { text: "An investment in knowledge pays the best interest.", category: "Education" },
        { text: "Education is the most powerful weapon which you can use to change the world.", category: "Education" },
        { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", category: "Education" },
        { text: "The beautiful thing about learning is that no one can take it away from you.", category: "Education" },
        { text: "Health is the greatest gift, contentment the greatest wealth, faithfulness the best relationship.", category: "Health" },
        { text: "Take care of your body. It’s the only place you have to live.", category: "Health" },
        { text: "A healthy outside starts from the inside.", category: "Health" },
        { text: "It is health that is real wealth and not pieces of gold and silver.", category: "Health" },
        { text: "The best way to predict the future is to create it.", category: "Innovation" },
        { text: "Innovation distinguishes between a leader and a follower.", category: "Innovation" },
        { text: "Logic will get you from A to B. Imagination will take you everywhere.", category: "Innovation" },
        { text: "Creativity is thinking up new things. Innovation is doing new things.", category: "Innovation" }
    ];

    if (!Array.isArray(quotes) || !quotes.every(q => q.text && q.category)) {
        console.error('Invalid quotes data structure');
        return;
    }

    localStorage.setItem("quotes", JSON.stringify(quotes));

    function showRandomQuote() {
        quoteDisplay.innerHTML = '';
        const filteredQuotes = categorySelect.value === "All" ? quotes : quotes.filter(q => q.category === categorySelect.value);

        if (filteredQuotes.length === 0) {
            quoteDisplay.textContent = "No quotes available in this category.";
            return;
        }

        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const quoteText = document.createElement('p');
        quoteText.textContent = filteredQuotes[randomIndex].text;
        quoteDisplay.appendChild(quoteText);
    }

    function addQuote() {
        const quote = addquote.value.trim();
        const category = addCat.value.trim();

        if (!quote || !category) {
            alert('Please enter a quote and a category.');
            return;
        }

        const newQuote = { text: quote, category };
        quotes.push(newQuote);
        localStorage.setItem("quotes", JSON.stringify(quotes));

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

    const addit = document.querySelector('button');
    if (addit) {
        addit.addEventListener('click', addQuote);
    } else {
        console.error('Add Quote button not found');
    }

    randomQuote.addEventListener("click", showRandomQuote);
});
