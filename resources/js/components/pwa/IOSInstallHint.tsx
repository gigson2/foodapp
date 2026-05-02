import { Card } from '@/components/common/Card';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

export function IOSInstallHint() {
    const { isIos, isStandalone } = useInstallPrompt();

    if (! isIos || isStandalone) {
        return null;
    }

    return (
        <Card className="p-4 text-sm leading-7 text-muted">
            On iPhone or iPad, tap <span className="font-semibold text-[color:var(--text-950)]">Share</span>, then{' '}
            <span className="font-semibold text-[color:var(--text-950)]">Add to Home Screen</span> to install Dri Grill.
        </Card>
    );
}
