// Fonction pour convertir HSL en RGB
const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(Math.min(k(n) - 3, 9 - k(n), 1), -1);

    return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))];
};

// Fonction pour convertir une valeur RGB en hexadécimal
const rgbToHex = (r: number, g: number, b: number): string => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
};

// Fonction pour générer une couleur de fond basée sur un texte
export const getBackgroundColor = (text: string): string => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = hash % 360;
    const s = 70;
    const l = 70;
    const [r, g, b] = hslToRgb(h, s, l);
    return rgbToHex(r, g, b);
};


// Fonction pour calculer la luminance relative d'une couleur
const luminance = (r : number, g : number, b : number) : number => {
    const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

// Fonction pour calculer le contraste entre deux couleurs
const contrast = (rgb1 : number[], rgb2 : number[])  : number => {
    const lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
    const lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
};

// Fonction pour déterminer la couleur de texte appropriée
export const appropriateTextColor = (backgroundColor: string): string => {
    if (backgroundColor.charAt(0) === '#') backgroundColor = backgroundColor.substring(1);

    const rgbHex = backgroundColor.match(/.{1,2}/g);
    if (!rgbHex) {
        throw new Error("Invalid background color format");
    }

    const rgb = rgbHex.map((hex) => parseInt(hex, 16));
    const black = [0, 0, 0];
    return contrast(rgb, black) >= 4.5 ? '#000000' : '#FFFFFF';
};