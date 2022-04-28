import './Dossier.scss';
import { useState } from 'react'; 
import IconButton from '@mui/material/IconButton';
import SortIcon from '@mui/icons-material/Sort';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import couvertureDefaut from '../images/couverture-defaut.png';
import { formaterDateFR } from '../code/helper';
import FrmDossier from './FrmDossier';
import * as signetModele from '../code/signet-modele';
import { UtilisateurContext } from './Appli';
import { useContext } from 'react';

export default function Dossier({id, titre, couleur, dateModif, couverture, supprimerDossier ,modifierDossier, top3}) {
  const utilisateur = useContext(UtilisateurContext);

  //état des signets dans ce dossier
  const [signets ,setSignets] = useState(top3 || []);

  //état du menu contextuel
  const [eltAncrage, setEltAncrage] = useState(null);
  const ouvertMenu = Boolean(eltAncrage);

  //état du formulaire de modification
  const [ouvertForm, setOuvertForm] = useState(false);

  function gererMenu(event) {
    setEltAncrage(event.currentTarget);
  };

  function gererFermerMenu() {
    setEltAncrage(null);
  };

  function afficherFormulaireDossier(){
    //Ouvrir le formulaire de modification du dossier (transférer l'info du dossier dans le formulaire)
    setOuvertForm(true);

    //puis fermer le menu
    gererFermerMenu();
  }

  function gererSupprimer(){
    //Appeler la fonction de ListeDossier qui gère la suppression dans firestore
    supprimerDossier(id);

    //puis fermer le menu
    gererFermerMenu();
  }

  //[TODO : déplacer cette fonction dans le formulaire et l'améliorer]
  //tester si l'URL dans la variable couverture est valide
  let urlCouverture; 
  try {
  urlCouverture = new URL(couverture);
  } catch(e){
    couverture = couvertureDefaut;
  }

  //état dropzone
  const [dropzone, setDropzone] = useState(false);

  function gererDragEnter(event){
    event.preventDefault();
    event.dataTransfer.effectAllowed('link');
    setDropzone(true);
  }

  function gererDragOver(event){
    event.preventDefault();
  }

  function gererDrop(event){
    event.preventDefault();
    setDropzone(false);
    let url = event.dataTransfer.getData("URL");
    //on voudrait aussi aller chercher le title(à implémenter plus tard)

    //on appelle la méthode d'ajout d'un signet dans un dossier défini dans le composant parent
    //elle prend l'id du dossier et l'url déposée
    ajouterSignet(id, url);
  }

  function gererDragLeave(event){
    setDropzone(false);
  }

  function ajouterSignet(idDossier, url){
    const derniers3 = [...signets, {adresse: url, titre:'placeholder'}].slice(-3);
    signetModele.creer(utilisateur.uid, idDossier, derniers3).then(
      () => setSignets(derniers3)
    );
  }

  return (
    <article onDrop={gererDrop} onDragEnter={gererDragEnter} onDragOver={gererDragOver} onDragLeave={gererDragLeave} className={"Dossier " + (dropzone ? 'dropzone' : '')} style={{backgroundColor: couleur}}>
      <IconButton className="deplacer" aria-label="déplacer" disableRipple={true}>
          <SortIcon />
        </IconButton>
      <div className="couverture">
        <img src={couverture || couvertureDefaut} alt={titre}/>
      </div>
      <div className="info">
        <h2>{titre}</h2>
        <p>Modifié : {formaterDateFR(dateModif.seconds)}</p>
      </div>
      <IconButton onClick={gererMenu} className="modifier" aria-label="modifier" size="small">
        <MoreVertIcon />
      </IconButton>

      <Menu
        id="menu-contextuel-dossier"
        anchorEl={eltAncrage}
        open={ouvertMenu}
        onClose={gererFermerMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={afficherFormulaireDossier}>Modifier</MenuItem>
        <MenuItem onClick={gererSupprimer}>Supprimer</MenuItem>
      </Menu>
       <FrmDossier ouvert={ouvertForm} setOuvert={setOuvertForm} id={id} titre_p={titre} couleur_p={couleur} couverture_p={couverture} gererActionDossier={modifierDossier} />
    </article>
  );
}