export interface Quote {
    text: string;
    author?: string;
    category: string;
    color: number;
}

function getRandomColor(): number {
    const colors = [
        0xFF6B6B, // Coral
        0x4ECDC4, // Turquoise
        0x45B7D1, // Sky Blue
        0x96CEB4, // Mint
        0xFECA57, // Yellow
        0xFF9FF3, // Pink
        0x54A0FF, // Blue
        0x5F27CD, // Purple
        0x00D2D3, // Cyan
        0xFF9F43, // Orange
        0x10AC84, // Green
        0xEE5A24, // Red Orange
        0x0ABDE3, // Light Blue
        0x006BA6, // Dark Blue
        0xC44569, // Dark Pink
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

export const motivationalQuotes: Quote[] = [
    { text: "The only way to do great work is to love what you do", author: "Steve Jobs", category: "motivation", color: getRandomColor() },
    { text: "Innovation distinguishes between a leader and a follower", author: "Steve Jobs", category: "leadership", color: getRandomColor() },
    { text: "Your limitation—it's only your imagination", category: "mindset", color: getRandomColor() },
    { text: "Push yourself, because no one else is going to do it for you", category: "motivation", color: getRandomColor() },
    { text: "Great things never come from comfort zones", category: "growth", color: getRandomColor() },
    { text: "Dream it. Wish it. Do it", category: "dreams", color: getRandomColor() },
    { text: "Success doesn't just find you. You have to go out and get it", category: "success", color: getRandomColor() },
    { text: "The harder you work for something, the greater you'll feel when you achieve it", category: "achievement", color: getRandomColor() },
    { text: "Dream bigger. Do bigger", category: "dreams", color: getRandomColor() },
    { text: "Don't stop when you're tired. Stop when you're done", category: "perseverance", color: getRandomColor() }
];

export const wisdomQuotes: Quote[] = [
    { text: "The journey of a thousand miles begins with one step", author: "Lao Tzu", category: "wisdom", color: getRandomColor() },
    { text: "Yesterday is history, tomorrow is a mystery, today is a gift", category: "mindfulness", color: getRandomColor() },
    { text: "Be yourself; everyone else is already taken", author: "Oscar Wilde", category: "authenticity", color: getRandomColor() },
    { text: "In the middle of difficulty lies opportunity", author: "Albert Einstein", category: "opportunity", color: getRandomColor() },
    { text: "The only impossible journey is the one you never begin", author: "Tony Robbins", category: "beginning", color: getRandomColor() },
    { text: "Life is what happens to you while you're busy making other plans", author: "John Lennon", category: "life", color: getRandomColor() },
    { text: "The future belongs to those who believe in the beauty of their dreams", author: "Eleanor Roosevelt", category: "dreams", color: getRandomColor() },
    { text: "It is during our darkest moments that we must focus to see the light", author: "Aristotle", category: "hope", color: getRandomColor() },
    { text: "The way to get started is to quit talking and begin doing", author: "Walt Disney", category: "action", color: getRandomColor() },
    { text: "Don't judge each day by the harvest you reap but by the seeds that you plant", author: "Robert Louis Stevenson", category: "patience", color: getRandomColor() }
];

export const happinessQuotes: Quote[] = [
    { text: "Happiness is not something ready made. It comes from your own actions", author: "Dalai Lama", category: "happiness", color: getRandomColor() },
    { text: "The most important thing is to enjoy your life—to be happy—it's all that matters", author: "Audrey Hepburn", category: "joy", color: getRandomColor() },
    { text: "Happiness is when what you think, what you say, and what you do are in harmony", author: "Mahatma Gandhi", category: "harmony", color: getRandomColor() },
    { text: "Count your age by friends, not years. Count your life by smiles, not tears", author: "John Lennon", category: "friendship", color: getRandomColor() },
    { text: "The secret of being happy is accepting where you are in life and making the most out of everyday", category: "acceptance", color: getRandomColor() },
    { text: "Smile in the mirror. Do that every morning and you'll start to see a big difference in your life", author: "Yoko Ono", category: "positivity", color: getRandomColor() },
    { text: "Life is really simple, but we insist on making it complicated", author: "Confucius", category: "simplicity", color: getRandomColor() },
    { text: "The best way to cheer yourself up is to try to cheer somebody else up", author: "Mark Twain", category: "kindness", color: getRandomColor() },
    { text: "Happiness is not by chance, but by choice", category: "choice", color: getRandomColor() },
    { text: "Every day may not be good, but there's something good in every day", category: "optimism", color: getRandomColor() }
];

export const strengthQuotes: Quote[] = [
    { text: "You are braver than you believe, stronger than you seem, and smarter than you think", author: "A.A. Milne", category: "strength", color: getRandomColor() },
    { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us", author: "Ralph Waldo Emerson", category: "inner strength", color: getRandomColor() },
    { text: "You have been assigned this mountain to show others it can be moved", category: "resilience", color: getRandomColor() },
    { text: "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't", category: "overcoming", color: getRandomColor() },
    { text: "You are never too old to set another goal or to dream a new dream", author: "C.S. Lewis", category: "renewal", color: getRandomColor() },
    { text: "The strongest people are not those who show strength in front of us, but those who win battles we know nothing about", category: "hidden strength", color: getRandomColor() },
    { text: "You were given this life because you are strong enough to live it", category: "purpose", color: getRandomColor() },
    { text: "Sometimes you don't realize your own strength until you come face to face with your greatest weakness", category: "self-discovery", color: getRandomColor() },
    { text: "Rock bottom became the solid foundation on which I rebuilt my life", author: "J.K. Rowling", category: "rebuilding", color: getRandomColor() },
    { text: "You are confined only by the walls you build yourself", category: "limitation", color: getRandomColor() }
];

export const allQuotes = [
    ...motivationalQuotes,
    ...wisdomQuotes,
    ...happinessQuotes,
    ...strengthQuotes
];

export function getQuotesByCategory(category: string): Quote[] {
    return allQuotes.filter(quote => quote.category === category);
}

export function getRandomQuote(): Quote {
    return allQuotes[Math.floor(Math.random() * allQuotes.length)];
}

export function getRandomQuoteFromCategory(category: string): Quote {
    const categoryQuotes = getQuotesByCategory(category);
    return categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
}