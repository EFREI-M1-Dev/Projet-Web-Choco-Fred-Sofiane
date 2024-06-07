export const formatTimestamp = (timestamp: number): string => {
    const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

    const now = new Date();
    const date = new Date(timestamp);

    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);

    const hoursSinceMidnight = (now.getHours());

    const diffDays = Math.floor(diffHours / hoursSinceMidnight);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    const formatTime = (date: Date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}H${minutes}`;
    };

    if (diffDays === 0) {
        return `Aujd à ${formatTime(date)}`;
    } else if (diffDays === 1) {
        return `Hier à ${formatTime(date)}`;
    } else if (diffDays < 7 && date.getDay() >= now.getDay() - (now.getDay() + 1)) {
        return `${daysOfWeek[date.getDay()]} à ${formatTime(date)}`;
    } else if (diffDays < 7) {
        return `Il y a ${diffDays} jours`;
    } else if (diffWeeks < 4) {
        return `Il y a ${diffWeeks} semaines`;
    } else if (diffMonths < 12) {
        return `Il y a ${diffMonths} mois`;
    } else {
        return `Il y a ${diffYears} ans`;
    }
}