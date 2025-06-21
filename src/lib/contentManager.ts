import { texts } from './texts';
import { allQuotes, getRandomQuote, type Quote } from './quoteCategories';
import { getTodaysInspiration, getRandomInspiration, type InspirationIdea } from './inspirationalIdeas';
import { getRandomImage, type InspirationImage } from './inspirationalImages';

export type ContentType = 'quote' | 'inspiration' | 'original';

export interface ContentItem {
    text: string;
    color: number;
    type: ContentType;
    author?: string;
    category?: string;
    action?: string;
    title?: string;
    image?: InspirationImage;
}

export class ContentManager {
    private static instance: ContentManager;
    
    static getInstance(): ContentManager {
        if (!ContentManager.instance) {
            ContentManager.instance = new ContentManager();
        }
        return ContentManager.instance;
    }

    getRandomContent(): ContentItem {
        const contentTypes: ContentType[] = ['quote', 'inspiration', 'original'];
        const randomType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
        
        switch (randomType) {
            case 'quote':
                return this.getRandomQuoteContent();
            case 'inspiration':
                return this.getRandomInspirationContent();
            case 'original':
            default:
                return this.getRandomOriginalContent();
        }
    }

    getTodaysContent(): ContentItem {
        const today = new Date();
        const dayOfWeek = today.getDay();
        
        // Different content types for different days
        if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend - inspiration
            return this.getTodaysInspirationContent();
        } else if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) { // Mon, Wed, Fri - quotes
            return this.getRandomQuoteContent();
        } else { // Tue, Thu - original
            return this.getRandomOriginalContent();
        }
    }

    private getRandomQuoteContent(): ContentItem {
        const quote = getRandomQuote();
        const image = getRandomImage();
        
        return {
            text: quote.text,
            color: quote.color,
            type: 'quote',
            author: quote.author,
            category: quote.category,
            image
        };
    }

    private getRandomInspirationContent(): ContentItem {
        const inspiration = getRandomInspiration();
        const image = getRandomImage();
        
        return {
            text: inspiration.description,
            color: inspiration.color,
            type: 'inspiration',
            title: inspiration.title,
            action: inspiration.action,
            image
        };
    }

    private getTodaysInspirationContent(): ContentItem {
        const inspiration = getTodaysInspiration();
        const image = getRandomImage();
        
        return {
            text: inspiration.description,
            color: inspiration.color,
            type: 'inspiration',
            title: inspiration.title,
            action: inspiration.action,
            image
        };
    }

    private getRandomOriginalContent(): ContentItem {
        const originalText = texts[Math.floor(Math.random() * texts.length)];
        const image = getRandomImage();
        
        return {
            text: originalText.text,
            color: originalText.color,
            type: 'original',
            image
        };
    }

    formatContentForDisplay(content: ContentItem, maxCharsPerLine: number = 17): string {
        let displayText = '';
        
        if (content.type === 'inspiration' && content.title) {
            displayText = `${content.title}\n\n${content.text}`;
            if (content.action) {
                displayText += `\n\n${content.action}`;
            }
        } else {
            displayText = content.text;
            if (content.author) {
                displayText += `\n\n- ${content.author}`;
            }
        }
        
        return this.splitTextAtCharCount(displayText, maxCharsPerLine);
    }

    private splitTextAtCharCount(text: string, charCount: number): string {
        const lines = text.split('\n');
        let result = '';
        
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim() === '') {
                result += '\n';
                continue;
            }
            
            const words = lines[i].split(' ');
            let currentLine = '';
            
            for (const word of words) {
                if (currentLine.length + word.length + 1 <= charCount) {
                    currentLine += (currentLine ? ' ' : '') + word;
                } else {
                    if (currentLine) {
                        result += currentLine + '\n';
                        currentLine = word;
                    } else {
                        // Word is longer than charCount, just add it
                        result += word + '\n';
                    }
                }
            }
            
            if (currentLine) {
                result += currentLine;
            }
            
            if (i < lines.length - 1) {
                result += '\n';
            }
        }
        
        return result;
    }
}