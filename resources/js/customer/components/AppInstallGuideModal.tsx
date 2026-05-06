import { useState } from 'react';
import { Download, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { cn } from '@/utils/classNames';

type AppInstallGuideModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

type InstallTab = 'android' | 'ios';

function InstallStep({
    body,
    number,
    title,
}: {
    number: string;
    title: string;
    body: string;
}) {
    return (
        <div className="ui-outline rounded-[1.5rem] px-4 py-4 sm:px-5">
            <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--primary-500)] text-sm font-semibold text-white">
                    {number}
                </div>
                <div>
                    <h4 className="text-base font-semibold text-[color:var(--text-950)]">{title}</h4>
                    <p className="mt-1 text-sm leading-7 text-muted">{body}</p>
                </div>
            </div>
        </div>
    );
}

export function AppInstallGuideModal({ isOpen, onClose }: AppInstallGuideModalProps) {
    const [activeTab, setActiveTab] = useState<InstallTab>('android');
    const { isStandalone, promptInstall } = useInstallPrompt();

    const androidInstallUnavailable = isStandalone;

    const handleAndroidInstall = async () => {
        const outcome = await promptInstall();

        if (outcome === 'accepted') {
            toast.success('Install started');
            return;
        }

        if (outcome === 'dismissed') {
            toast.message('Install prompt dismissed.');
            return;
        }

        toast.message('Use your browser menu and choose Install app or Add to Home screen.');
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            panelClassName="max-w-3xl"
            title="App Install Guide"
        >
            <div className="space-y-6">
                <div className="grid gap-2 rounded-[1.5rem] bg-[color:var(--ui-surface-muted)] p-2 sm:grid-cols-2">
                    <button
                        className={cn(
                            'ui-focus-ring rounded-[1.1rem] px-4 py-3 text-sm font-semibold transition',
                            activeTab === 'android'
                                ? 'bg-[color:var(--primary-500)] text-white shadow-[0_16px_32px_rgba(203,69,56,0.22)]'
                                : 'text-[color:var(--text-950)] hover:bg-white/60',
                        )}
                        onClick={() => setActiveTab('android')}
                        type="button"
                    >
                        Android
                    </button>
                    <button
                        className={cn(
                            'ui-focus-ring rounded-[1.1rem] px-4 py-3 text-sm font-semibold transition',
                            activeTab === 'ios'
                                ? 'bg-[color:var(--primary-500)] text-white shadow-[0_16px_32px_rgba(203,69,56,0.22)]'
                                : 'text-[color:var(--text-950)] hover:bg-white/60',
                        )}
                        onClick={() => setActiveTab('ios')}
                        type="button"
                    >
                        iPhone / iPad
                    </button>
                </div>

                {activeTab === 'android' ? (
                    <div className="space-y-4">
                        <div className="rounded-[1.75rem] border border-white/10 bg-white/6 p-5">
                            <div className="flex items-start gap-3">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[color:var(--primary-500)] text-white">
                                    <Smartphone className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">Install on Android</h3>
                                    <p className="mt-2 text-sm leading-7 text-muted">
                                        Use Chrome or another supported Android browser to add Dris Foods to your home screen for faster access.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <InstallStep
                            body="Keep this page open in Chrome or another supported browser on your Android phone."
                            number="1"
                            title="Open the website on your phone"
                        />
                        <InstallStep
                            body="Tap the install button below. If your browser shows an install prompt, continue to the next step."
                            number="2"
                            title="Start the install"
                        />
                        <InstallStep
                            body="Review the prompt and tap Install to add the app to your device."
                            number="3"
                            title="Confirm installation"
                        />
                        <InstallStep
                            body="Open the installed app from your home screen, then sign in and enable push notifications from your profile if needed."
                            number="4"
                            title="Launch the app"
                        />

                        <div className="rounded-[1.5rem] border border-dashed border-[color:var(--ui-border-strong)] bg-[color:var(--ui-surface-muted)] px-4 py-4 sm:px-5">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-[color:var(--text-950)]">Android install action</p>
                                    <p className="mt-1 text-sm leading-7 text-muted">
                                        If your browser does not show a native install prompt, open the browser menu and choose <span className="font-semibold text-[color:var(--text-950)]">Install app</span> or <span className="font-semibold text-[color:var(--text-950)]">Add to Home screen</span>.
                                    </p>
                                </div>
                                <Button
                                    disabled={androidInstallUnavailable}
                                    onClick={handleAndroidInstall}
                                    size="sm"
                                    type="button"
                                >
                                    <Download className="h-4 w-4" />
                                    {isStandalone ? 'Already installed' : 'Install app'}
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="rounded-[1.75rem] border border-white/10 bg-white/6 p-5">
                            <div className="flex items-start gap-3">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[color:var(--primary-500)] text-white">
                                    <Smartphone className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">Install on iPhone or iPad</h3>
                                    <p className="mt-2 text-sm leading-7 text-muted">
                                        Safari does not show the Android-style install prompt. Use the Share menu to add the app to your Home Screen.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <InstallStep
                            body="Open this website in Safari on your iPhone or iPad."
                            number="1"
                            title="Use Safari"
                        />
                        <InstallStep
                            body="Tap the Share icon at the bottom or top of the Safari screen."
                            number="2"
                            title="Open the Share menu"
                        />
                        <InstallStep
                            body="Scroll through the actions and tap Add to Home Screen."
                            number="3"
                            title="Choose Add to Home Screen"
                        />
                        <InstallStep
                            body="Tap Add, then launch the app from your Home Screen and enable push notifications if your browser supports them."
                            number="4"
                            title="Finish and open the app"
                        />
                    </div>
                )}
            </div>
        </Modal>
    );
}
