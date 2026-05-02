import type { PropsWithChildren } from 'react';
import { Modal } from '@/components/common/Modal';

type BottomSheetProps = PropsWithChildren<{
    isOpen: boolean;
    title: string;
    description?: string;
    onClose: () => void;
}>;

export function BottomSheet({ children, description, isOpen, onClose, title }: BottomSheetProps) {
    return (
        <Modal
            description={description}
            isOpen={isOpen}
            onClose={onClose}
            panelClassName="max-h-[88vh] overflow-y-auto"
            position="bottom"
            title={title}
        >
            {children}
        </Modal>
    );
}
