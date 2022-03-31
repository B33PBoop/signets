import { bdFirestore } from "./init";
import { getDocs, getDoc, collection, addDoc, Timestamp } from "firebase/firestore";

/**
 * Obtenir tout les dossiers d'un utilisateur
 * @param {string} idUtilisateur Identifiant firebase de l'utilisateur connecté
 * @returns {Promise<any[]>} Promesse avec le tableau des dossiers lorsque complété
 */
export async function lireTout(idUtilisateur){
    return getDocs(collection(bdFirestore, 'signets', idUtilisateur, 'dossiers')).then(
        resultat => resultat.docs.map(doc => ({id: doc.id, ...doc.data()}))
    );
}

//Ajouter un dossier
export async function creer(idUtilisateur, dossier){
    //Ajout de dateModif à l'objet
    dossier.dateModif = Timestamp.now();
    let coll = collection(bdFirestore, 'signets', idUtilisateur, 'dossiers');
    let refDoc = await addDoc(coll, dossier);
    return await getDoc(refDoc);
}