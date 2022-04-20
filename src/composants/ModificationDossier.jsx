import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {TwitterPicker} from 'react-color';
import { useState } from 'react';

export default function ModificationDossier({ouvert, setOuvert, id, titre_p, couleur_p, couverture_p, modifierDossier}) {

  const [titre, setTitre] = useState(titre_p);
  const [couverture, setCouverture] = useState(couverture_p);
  const [couleur, setCouleur] = useState(couleur_p);

  const gererFermer = () => {
    setOuvert(false);
  };
  
  function gererAnnuler(){
    setTitre(titre_p);
    setCouverture(couverture_p);
    setCouleur(couleur_p);

    gererFermer();
  }

  function gererSoumettre(){
    if(titre.search(/[a-z]{2,}/i) !== -1){
    //Code gérant la modification dans firestore
      modifierDossier(id, titre, couverture, couleur);

      //réinitialisation et fermeture du formulaire
      gererFermer();
    }
  }

  return (
    <div>
      <Dialog open={ouvert} onClose={gererFermer}>
        <DialogTitle>Modifier le Dossier</DialogTitle>
        <DialogContent>
            {/*Titre du dossier*/}
          <TextField
            autoFocus
            margin="dense"
            id="titre"
            label="Titre du dossier"
            type="text"
            fullWidth
            variant="standard"
            onChange={evt => setTitre(evt.target.value)}
            value={titre}
          />
            {/*Image de couverture du dossier */}
          <TextField
            margin="dense"
            id="couverture"
            label="Image de couverture du dossier"
            type="url"
            fullWidth
            variant="standard"
            onChange={evt => setCouverture(evt.target.value)}
            value={couverture}
          />
            {/*Choix de couleur*/}
        <TwitterPicker 
            colors={["#bd3", "#000", "#2fa", "#c5d"]}
            width = "auto"
            triangle='hide'
            color={couleur}
            onChangeComplete={couleur => setCouleur(couleur.hex)}
            value={couleur}
        />
        </DialogContent>
        <DialogActions>
          <Button onClick={gererAnnuler}>Annuler</Button>
          <Button onClick={gererSoumettre}>Soumettre</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
