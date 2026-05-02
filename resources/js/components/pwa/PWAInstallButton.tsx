import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/common/Button';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

export function PWAInstallButton() {
    const { canInstall, isIos, isStandalone, promptInstall } = useInstallPrompt();

    if (isStandalone || ! canInstall || isIos) {
        return null;
    }

    return (
        <Button
            onClick={async () => {
                const outcome = await promptInstall();

                if (outcome === 'accepted') {
                    toast.success('Install started');
                }
            }}
            variant="secondary"
        >
            <Download className="h-4 w-4" />
            Install PWA
        </Button>
    );
}
