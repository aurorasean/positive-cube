export interface InspirationIdea {
    title: string;
    description: string;
    action: string;
    color: number;
}

export const dailyInspirations: InspirationIdea[] = [
    {
        title: "Practice Gratitude",
        description: "Take 5 minutes to write down three things you're grateful for today",
        action: "Start a gratitude journal",
        color: 0x4CAF50
    },
    {
        title: "Random Act of Kindness",
        description: "Do something nice for someone without expecting anything in return",
        action: "Brighten someone's day",
        color: 0xFF6B6B
    },
    {
        title: "Learn Something New",
        description: "Spend 15 minutes learning about a topic that interests you",
        action: "Feed your curiosity",
        color: 0x3498DB
    },
    {
        title: "Connect with Nature",
        description: "Step outside and take a mindful walk, even if it's just for 10 minutes",
        action: "Breathe fresh air",
        color: 0x2ECC71
    },
    {
        title: "Digital Detox Hour",
        description: "Put away all devices for one hour and engage in a mindful activity",
        action: "Disconnect to reconnect",
        color: 0x9B59B6
    },
    {
        title: "Creative Expression",
        description: "Draw, write, sing, or create something just for the joy of it",
        action: "Let your creativity flow",
        color: 0xF39C12
    },
    {
        title: "Mindful Breathing",
        description: "Practice deep breathing for 5 minutes to center yourself",
        action: "Find your inner calm",
        color: 0x1ABC9C
    },
    {
        title: "Reach Out to Someone",
        description: "Call or message someone you haven't spoken to in a while",
        action: "Strengthen connections",
        color: 0xE74C3C
    },
    {
        title: "Organize Your Space",
        description: "Tidy up one area of your living space to create mental clarity",
        action: "Clear space, clear mind",
        color: 0x34495E
    },
    {
        title: "Set a Small Goal",
        description: "Choose one small, achievable goal for today and work towards it",
        action: "Take one step forward",
        color: 0x8E44AD
    }
];

export function getTodaysInspiration(): InspirationIdea {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    return dailyInspirations[dayOfYear % dailyInspirations.length];
}

export function getRandomInspiration(): InspirationIdea {
    return dailyInspirations[Math.floor(Math.random() * dailyInspirations.length)];
}