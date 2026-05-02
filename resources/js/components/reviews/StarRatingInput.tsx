import { Star } from 'lucide-react';
import { cn } from '@/utils/classNames';

type StarRatingInputProps = {
    value: number;
    onChange: (value: number) => void;
};

export function StarRatingInput({ onChange, value }: StarRatingInputProps) {
    return (
        <div>
            <span className="mb-2 block text-sm font-medium text-[color:var(--text-950)]">Rating</span>
            <div className="flex items-center gap-2">
                {Array.from({ length: 5 }, (_, index) => {
                    const starValue = index + 1;

                    return (
                        <button
                            aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
                            className="rounded-full p-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-500)]/60"
                            key={starValue}
                            onClick={() => onChange(starValue)}
                            type="button"
                        >
                            <Star
                                className={cn(
                                    'h-7 w-7 transition',
                                    starValue <= value
                                        ? 'fill-[color:var(--accent-500)] text-[color:var(--accent-500)]'
                                        : 'text-[color:var(--text-800)]',
                                )}
                            />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
