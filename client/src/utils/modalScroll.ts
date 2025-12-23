let prevOverflow = '';
let prevPaddingRight = '';

export function lockScroll() {
    prevOverflow = document.body.style.overflow;
    prevPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';
}

export function unlockScroll() {
    document.body.style.overflow = prevOverflow;
    document.body.style.paddingRight = prevPaddingRight;
}
