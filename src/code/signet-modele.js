import { doc, updateDoc, } from "firebase/firestore";
import { bdFirestore } from "./init";


/**
 * Ajoute un signet en recréant le tableau des top3 dans le dossier identifié
 * @param {string} uid ID firebaseAuth de l'utilisateur connecté
 * @param {string} idDossier id firestore du dossier dans lequel ajouter le signet
 * @param {object[]} derniers3 tableau des objets signets représentant les 3 signets à conserver
 * @returns {Promise<void>} Promesse (sans paramètres) une fois la requête firestore complétée
 */
export async function creer(uid, idDossier, derniers3){
    //référence au document dans lequel on veut ajouter le signet
    let docRef = doc(bdFirestore, 'signets', uid, 'dossiers', idDossier);
    return await updateDoc(docRef, {top3 : derniers3});
}