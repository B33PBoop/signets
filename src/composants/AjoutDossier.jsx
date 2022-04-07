import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {TwitterPicker} from 'react-color';
import { useState } from 'react';

export default function AjoutDossier({ouvert, setOuvert, gererAjoutDossier}) {

  const [titre, setTitre] = useState('');
  const [couverture, setCouverture] = useState('');
  const [couleur, setCouleur] = useState('#000');

  const gererFermer = () => {
    setTitre('');
    setCouverture('');
    setCouleur('#000');
    setOuvert(false);
  };

  function gererSoumettre(){
    if(titre.search(/[a-z]{2,}/i) !== -1){

    //Code gérant l'ajout dans firestore
      gererAjoutDossier(titre,couverture,couleur);

      //réinitialisation et fermeture du formulaire
      gererFermer();
    }
  }

  return (
    <div>
      <Dialog open={ouvert} onClose={gererFermer}>
        <DialogTitle>Ajouter un Dossier</DialogTitle>
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

          />
            {/*Choix de couleur*/}
        <TwitterPicker 
            colors={["#bd3", "#000", "#2fa", "grey"]}
            width = "auto"
            triangle='hide'
            color={couleur}
            onChangeComplete={couleur => setCouleur(couleur.hex)}

        />
        </DialogContent>
        <DialogActions>
          <Button onClick={gererFermer}>Annuler</Button>
          <Button onClick={gererSoumettre}>Soumettre</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
