import { texts } from './texts';
import { allQuotes, getRandomQuote, type Quote } from './quoteCategories';
import { getTodaysInspiration, getRandomInspiration, dailyInspirations, type InspirationIdea } from './inspirationalIdeas';

export type ContentType = 'quote' | 'inspiration' | 'original';

export interface ContentItem {
    text: string;
    color: number;
    type: ContentType;
    author?: string;
    category?: string;
    action?: string;
    title?: string;
    id?: string; // Add unique identifier
}

export class ContentManager {
    private static instance: ContentManager;
    private readonly STORAGE_KEY = 'positive-cube-shown-content';
    
    static getInstance(): ContentManager {
        if (!ContentManager.instance) {
            ContentManager.instance = new ContentManager();
        }
        return ContentManager.instance;
    }

    private getShownContent(): Set<string> {
        if (typeof window === 'undefined') return new Set();
        
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? new Set(JSON.parse(stored)) : new Set();
        } catch {
            return new Set();
        }
    }

    private saveShownContent(shownContent: Set<string>): void {
        if (typeof window === 'undefined') return;
        
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify([...shownContent]));
        } catch {
            // Ignore localStorage errors
        }
    }

    private markAsShown(contentId: string): void {
        const shownContent = this.getShownContent();
        shownContent.add(contentId);
        this.saveShownContent(shownContent);
    }

    private resetShownContent(): void {
        if (typeof window === 'undefined') return;
        
        try {
            localStorage.removeItem(this.STORAGE_KEY);
        } catch {
            // Ignore localStorage errors
        }
    }

    private getAllContentIds(): string[] {
        const allIds: string[] = [];
        
        // Add quote IDs
        allQuotes.forEach((quote, index) => {
            allIds.push(`quote-${index}`);
        });
        
        // Add inspiration IDs
        for (let i = 0; i < 10; i++) { // We have 10 daily inspirations
            allIds.push(`inspiration-${i}`);
        }
        
        // Add original text IDs
        texts.forEach((text, index) => {
            allIds.push(`original-${index}`);
        });
        
        return allIds;
    }

    private getUnshownContent(): string[] {
        const allIds = this.getAllContentIds();
        const shownContent = this.getShownContent();
        
        const unshown = allIds.filter(id => !shownContent.has(id));
        
        // If all content has been shown, reset and return all IDs
        if (unshown.length === 0) {
            this.resetShownContent();
            return allIds;
        }
        
        return unshown;
    }

    getRandomContent(): ContentItem {
        const unshownIds = this.getUnshownContent();
        const randomId = unshownIds[Math.floor(Math.random() * unshownIds.length)];
        
        this.markAsShown(randomId);
        
        const [type, indexStr] = randomId.split('-');
        const index = parseInt(indexStr);
        
        switch (type) {
            case 'quote':
                return this.getQuoteContent(index);
            case 'inspiration':
                return this.getInspirationContent(index);
            case 'original':
            default:
                return this.getOriginalContent(index);
        }
    }

    getTodaysContent(): ContentItem {
        const today = new Date();
        const dayOfWeek = today.getDay();
        
        // Different content types for different days
        if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend - inspiration
            return this.getTodaysInspirationContent();
        } else if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) { // Mon, Wed, Fri - quotes
            return this.getRandomContent(); // Use random to respect localStorage
        } else { // Tue, Thu - original
            return this.getRandomContent(); // Use random to respect localStorage
        }
    }

    private getQuoteContent(index: number): ContentItem {
        const quote = allQuotes[index];
        
        return {
            text: quote.text,
            color: quote.color,
            type: 'quote',
            author: quote.author,
            category: quote.category,
            id: `quote-${index}`
        };
    }

    private getInspirationContent(index: number): ContentItem {
        // Use modulo to cycle through inspirations if index is out of bounds
        const inspirationIndex = index % 10;
        const inspiration = this.getInspirationByIndex(inspirationIndex);
        
        return {
            text: inspiration.description,
            color: inspiration.color,
            type: 'inspiration',
            title: inspiration.title,
            action: inspiration.action,
            id: `inspiration-${index}`
        };
    }

    private getOriginalContent(index: number): ContentItem {
        const originalText = texts[index];
        
        return {
            text: originalText.text,
            color: originalText.color,
            type: 'original',
            id: `original-${index}`
        };
    }

    private getInspirationByIndex(index: number): InspirationIdea {
        return dailyInspirations[index];
    }

    private getRandomQuoteContent(): ContentItem {
        const quote = getRandomQuote();
        
        return {
            text: quote.text,
            color: quote.color,
            type: 'quote',
            author: quote.author,
            category: quote.category
        };
    }

    private getRandomInspirationContent(): ContentItem {
        const inspiration = getRandomInspiration();
        
        return {
            text: inspiration.description,
            color: inspiration.color,
            type: 'inspiration',
            title: inspiration.title,
            action: inspiration.action
        };
    }

    private getTodaysInspirationContent(): ContentItem {
        const inspiration = getTodaysInspiration();
        
        return {
            text: inspiration.description,
            color: inspiration.color,
            type: 'inspiration',
            title: inspiration.title,
            action: inspiration.action
        };
    }

    private getRandomOriginalContent(): ContentItem {
        const originalText = texts[Math.floor(Math.random() * texts.length)];
        
        return {
            text: originalText.text,
            color: originalText.color,
            type: 'original'
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
        displayText += "\n \n \n "
        
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

    // Debug method to check localStorage status
    getStorageStatus(): { shown: number; total: number; remaining: number } {
        const allIds = this.getAllContentIds();
        const shownContent = this.getShownContent();
        
        return {
            shown: shownContent.size,
            total: allIds.length,
            remaining: allIds.length - shownContent.size
        };
    }
}