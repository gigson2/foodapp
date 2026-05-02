import { X } from 'lucide-react';
import { useEffect, useId, useRef, type PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/classNames';

type ModalProps = PropsWithChildren<{
    isOpen: boolean;
    title: string;
    description?: string;
    onClose: () => void;
    panelClassName?: string;
    overlayClassName?: string;
    closeOnOverlay?: boolean;
    position?: 'center' | 'bottom';
}>;

function focusableElements(container: HTMLElement) {
    return Array.from(
        container.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
    ).filter((element) => !element.hasAttribute('disabled'));
}

export function Modal({
    children,
    closeOnOverlay = true,
    description,
    isOpen,
    onClose,
    overlayClassName,
    panelClassName,
    position = 'center',
    title,
}: ModalProps) {
    const titleId = useId();
    const descriptionId = useId();
    const panelRef = useRef<HTMLDivElement | null>(null);
    const previousFocused = useRef<Element | null>(null);

    useEffect(() => {
        if (! isOpen) {
            return;
        }

        previousFocused.current = document.activeElement;
        const panel = panelRef.current;

        if (panel) {
            const focusables = focusableElements(panel);
            (focusables[0] ?? panel).focus();
        }

        const handleKeydown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
            }

            if (event.key === 'Tab' && panelRef.current) {
                const focusables = focusableElements(panelRef.current);

                if (focusables.length === 0) {
                    return;
                }

                const first = focusables[0];
                const last = focusables[focusables.length - 1];

                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (! event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeydown);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeydown);
            if (previousFocused.current instanceof HTMLElement) {
                previousFocused.current.focus();
            }
        };
    }, [isOpen, onClose]);

    if (! isOpen) {
        return null;
    }

    return createPortal(
        <div
            className={cn(
                'fixed inset-0 z-[80] flex bg-[rgba(3,1,16,0.78)] px-3 py-4 backdrop-blur-md sm:px-6',
                position === 'bottom' ? 'items-end' : 'items-center justify-center',
                overlayClassName,
            )}
            onMouseDown={(event) => {
                if (closeOnOverlay && event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                aria-describedby={description ? descriptionId : undefined}
                aria-labelledby={titleId}
                aria-modal="true"
                className={cn(
                    'glass-card-strong relative flex max-h-[88vh] w-full flex-col overflow-hidden p-5 text-left shadow-[0_32px_90px_rgba(0,0,0,0.35)] outline-none sm:p-6',
                    position === 'center'
                        ? 'max-w-2xl'
                        : 'max-w-2xl rounded-b-none pb-[calc(1.5rem+env(safe-area-inset-bottom))]',
                    panelClassName,
                )}
                onMouseDown={(event) => event.stopPropagation()}
                ref={panelRef}
                role="dialog"
                tabIndex={-1}
            >
                <button
                    aria-label="Close dialog"
                    className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[color:var(--text-950)] transition hover:bg-white/16"
                    onClick={onClose}
                    type="button"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="pr-12">
                    <h2 className="text-2xl font-semibold" id={titleId}>
                        {title}
                    </h2>
                    {description ? (
                        <p className="mt-2 text-sm leading-7 text-muted" id={descriptionId}>
                            {description}
                        </p>
                    ) : null}
                </div>

                <div className="mt-6 overflow-y-auto pr-1">{children}</div>
            </div>
        </div>,
        document.body,
    );
}
