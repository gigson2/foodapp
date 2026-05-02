import { Share2 } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

export function IOSInstallHint() {
    const { canInstall, isIos, isStandalone } = useInstallPrompt();

    if (! isIos || isStandalone || canInstall) {
        return null;
    }

    return (
        <Badge className="bg-white/10 px-4 py-2 text-left text-[0.8rem] leading-6 text-muted">
            <Share2 className="mr-2 h-4 w-4 shrink-0" />
            Tap Share, then Add to Home Screen.
        </Badge>
    );
}
