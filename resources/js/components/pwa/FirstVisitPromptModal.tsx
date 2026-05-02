import type { ReactNode } from 'react';
import { BottomSheet } from '@/components/common/BottomSheet';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { useMediaQuery } from '@/hooks/useMediaQuery';

type FirstVisitPromptModalProps = {
    isOpen: boolean;
    title: string;
    description: string;
    icon?: ReactNode;
    primaryLabel: string;
    secondaryLabel?: string;
    onPrimary: () => void | Promise<void>;
    onSecondary?: () => void;
};

export function FirstVisitPromptModal({
    description,
    icon,
    isOpen,
    onPrimary,
    onSecondary,
    primaryLabel,
    secondaryLabel = 'Not now',
    title,
}: FirstVisitPromptModalProps) {
    const isMobile = useMediaQuery('(max-width: 767px)');

    const content = (
        <div className="space-y-5">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/6 p-5">
                {icon ? (
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--primary-500)] text-white">
                        {icon}
                    </div>
                ) : null}
                <p className="text-sm leading-7 text-muted">{description}</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
                {onSecondary ? (
                    <Button className="flex-1" onClick={onSecondary} variant="ghost">
                        {secondaryLabel}
                    </Button>
                ) : null}
                <Button className="flex-1" onClick={onPrimary}>
                    {primaryLabel}
                </Button>
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <BottomSheet description={description} isOpen={isOpen} onClose={onSecondary ?? (() => undefined)} title={title}>
                {content}
            </BottomSheet>
        );
    }

    return (
        <Modal
            description={description}
            isOpen={isOpen}
            onClose={onSecondary ?? (() => undefined)}
            panelClassName="max-w-lg"
            title={title}
        >
            {content}
        </Modal>
    );
}
