import type { PropsWithChildren } from 'react';
import { Modal } from '@/components/common/Modal';

type BottomSheetProps = PropsWithChildren<{
    isOpen: boolean;
    title: string;
    description?: string;
    onClose: () => void;
    panelClassName?: string;
}>;

export function BottomSheet({ children, description, isOpen, onClose, panelClassName, title }: BottomSheetProps) {
    return (
        <Modal
            description={description}
            isOpen={isOpen}
            onClose={onClose}
            panelClassName={`max-h-[82vh] max-w-[min(100%,30rem)] rounded-[1.75rem] pb-5 sm:max-h-[84vh] sm:max-w-xl md:max-w-2xl ${panelClassName ?? ''}`}
            position="center"
            title={title}
        >
            {children}
        </Modal>
    );
}
