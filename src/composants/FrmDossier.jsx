import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {TwitterPicker} from 'react-color';
import { useState } from 'react';

export default function FrmDossier({ouvert, setOuvert, id=null, titre_p='', couleur_p='', couverture_p='', gererActionDossier}) {

  const [titre, setTitre] = useState(titre_p);
  const [couverture, setCouverture] = useState(couverture_p);
  const [couleur, setCouleur] = useState(couleur_p);
  
  function viderEtFermerFrm(){
    setTitre(titre_p);
    setCouverture(couverture_p);
    setCouleur(couleur_p);

    setOuvert(false);
  }

  function gererSoumettre(){
    if(titre.search(/[a-z]+/i) !== -1){
    //Code gérant la modification dans firestore
      gererActionDossier(id, titre, couverture, couleur);

      //Appeler cette fonction uniquement lors de l'ajout d,un nouveau dossier
      if(id == null){
      viderEtFermerFrm();
      } else {
        setOuvert(false);
      }
    }
  }

  return (
    <div>
      <Dialog open={ouvert} onClose={viderEtFermerFrm}>
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
          <Button onClick={viderEtFermerFrm}>Annuler</Button>
          <Button onClick={gererSoumettre}>Soumettre</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
