export const handleLogOut = async () => {
    await fetch('http://localhost:3000/auth/logout', {
        credentials: 'include',
        cache: 'no-store',
        method: 'POST',
    });

    location.assign('/');
};
