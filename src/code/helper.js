/**
 * Formater une date dans le format francais suivant: jj/mm/aaaa
 * @param {Number} tsSecondes timestamp en secondes
 * @returns {String} chaine représentant le timestamp dans le format spécifié
 */
export function formaterDateFR(tsSecondes){
    const dateJS = new Date(tsSecondes*1000);
    const jour = dateJS.getDate();
    const listeMois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    const mois = listeMois[dateJS.getMonth()];
    const annee = dateJS.getFullYear();
    const dateFormatee = `${jour} ${mois} ${annee}`;
    return dateFormatee;
}