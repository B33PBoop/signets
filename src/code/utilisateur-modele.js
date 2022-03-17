import { authFirebase, authGoogle, bdFirestore } from './init';
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore';

/**
 * Ouvre une connexion Firebase Auth
 */
export function connexion(){
    signInWithPopup(authFirebase, authGoogle);
}

/**
 * Ferme la connexion Firebase Auth
 */
export function deconnexion(){
    authFirebase.signOut();
}

/**
 * Observe l'état de la connexion
 */
export function observerEtatConnexion(mutateurEtatUtil){
    onAuthStateChanged(authFirebase, 
        (user) => {
            if(user){
                //Sauvegarder le profil dans Firestore
                setDoc(doc(bdFirestore, 'signets', user.uid), {nom:user.displayName, courriel:user.email}, {merge:true})
            }
            mutateurEtatUtil(user)
        }
    )
}