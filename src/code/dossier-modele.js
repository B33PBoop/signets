import { bdFirestore } from "./init";
import { getDocs, getDoc, collection, addDoc, Timestamp, doc, deleteDoc, query, orderBy } from "firebase/firestore";

/**
 * Obtenir tout les dossiers d'un utilisateur, triés par date de modification descendante
 * @param {string} idUtilisateur Identifiant firebase de l'utilisateur connecté
 * @returns {Promise<any[]>} Promesse avec le tableau des dossiers lorsque complété
 */
export async function lireTout(idUtilisateur){
    return getDocs(query(collection(bdFirestore, 'signets', idUtilisateur, 'dossiers'),
    orderBy('dateModif', 'desc'))).then(
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

/**
 * Supprimer un dossier pour l'utilisateur connecté
 * @param {string} uid Identifiant firebase de l'utilisateur connecté
 * @param {string} idDossier ID du document correspondant au dossier à supprimer
 * @returns {Promise<void>} promesse contenant rien
 */
export async function supprimer(uid, idDossier){
    let refDoc = doc(bdFirestore, 'signets', uid, 'dossiers', idDossier);
    return await deleteDoc(refDoc);
}