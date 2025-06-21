export interface InspirationImage {
    url: string;
    description: string;
    theme: string;
    credit: string;
}

// Using Pexels stock photos for inspirational backgrounds
export const inspirationalImages: InspirationImage[] = [
    {
        url: "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
        description: "Sunrise over mountains",
        theme: "new beginnings",
        credit: "Pexels"
    },
    {
        url: "https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
        description: "Ocean waves at sunset",
        theme: "tranquility",
        credit: "Pexels"
    },
    {
        url: "https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
        description: "Forest path with sunlight",
        theme: "journey",
        credit: "Pexels"
    },
    {
        url: "https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
        description: "Starry night sky",
        theme: "dreams",
        credit: "Pexels"
    },
    {
        url: "https://images.pexels.com/photos/1366630/pexels-photo-1366630.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
        description: "Blooming flowers in spring",
        theme: "growth",
        credit: "Pexels"
    },
    {
        url: "https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
        description: "Peaceful lake reflection",
        theme: "reflection",
        credit: "Pexels"
    }
];

export function getRandomImage(): InspirationImage {
    return inspirationalImages[Math.floor(Math.random() * inspirationalImages.length)];
}

export function getImageByTheme(theme: string): InspirationImage | undefined {
    return inspirationalImages.find(img => img.theme === theme);
}