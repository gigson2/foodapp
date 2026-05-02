export function useScrollToSection() {
    return (sectionId: string) => {
        const element = document.getElementById(sectionId);

        if (! element) {
            return;
        }

        const offset = window.innerWidth >= 1024 ? 104 : window.innerWidth >= 768 ? 92 : 24;
        const top = element.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
            top,
            behavior: 'smooth',
        });
    };
}
