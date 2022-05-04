import './Dossier.scss';
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import SortIcon from '@mui/icons-material/Sort';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import couvertureDefaut from '../images/couverture-defaut.png';
import { formaterDateFR } from '../code/helper';
import FrmDossier from './FrmDossier';
import * as signetModele from '../code/signet-modele';
import { UtilisateurContext } from './Appli';
import { useContext } from 'react';
import ButtonUnstyled from '@mui/base/ButtonUnstyled';

export default function Dossier({ id, titre, couleur, dateModif, couverture, supprimerDossier, modifierDossier, top3 }) {
  const utilisateur = useContext(UtilisateurContext);

  //état des signets dans ce dossier
  const [signets, setSignets] = useState(top3 || []);

  //état de la carte active
  const [carteActive, setCarteActive] = useState(false);

  //état du menu contextuel
  const [eltAncrage, setEltAncrage] = useState(null);
  const ouvertMenu = Boolean(eltAncrage);

  //état du formulaire de modification
  const [ouvertForm, setOuvertForm] = useState(false);

  function gererMenu(evt) {
    evt.stopPropagation();
    setEltAncrage(evt.currentTarget);
  };

  function gererFermerMenu(evt) {
    evt.stopPropagation();
    setEltAncrage(null);
  };

  function afficherFormulaireDossier(evt){
    evt.stopPropagation();

    //Ouvrir le formulaire de modification du dossier (transférer l'info du dossier dans le formulaire)
    setOuvertForm(true);

    //puis fermer le menu
    gererFermerMenu(evt);
  }

  function gererSupprimer(evt) {
    evt.stopPropagation();
    //Appeler la fonction de ListeDossier qui gère la suppression dans firestore
    supprimerDossier(id);

    //puis fermer le menu
    gererFermerMenu(evt);
  }

  //[TODO : déplacer cette fonction dans le formulaire et l'améliorer]
  //tester si l'URL dans la variable couverture est valide
  let urlCouverture;
  try {
    urlCouverture = new URL(couverture);
  } catch (e) {
    couverture = couvertureDefaut;
  }

  //état dropzone
  const [dropzone, setDropzone] = useState(false);

  function gererDragEnter(evt){
    evt.preventDefault();
    evt.dataTransfer.effectAllowed = 'link';
    setDropzone(true);
  }

  function gererDragOver(evt) {
    evt.preventDefault();
  }

  function gererDrop(evt) {
    evt.preventDefault();
    setDropzone(false);
    let url = evt.dataTransfer.getData("URL");
    //on voudrait aussi aller chercher le title 
    //!!Ce Code ne fonctionne que si on peut héberger un script serveur 
    //sur le même domaine pour faire l'extraction des titres des URL!!

    fetch("https://cors-anywhere.herokuapp.com/" + url)
    .then(reponse => reponse.text())
    .then(
        chaineDoc => {
        const doc = new DOMParser().parseFromString(chaineDoc, "text/html");
        const titre = doc.querySelectorAll('title')[0];

        //on appelle la méthode d'ajout d'un signet dans un dossier défini dans le composant parent
        //elle prend l'id du dossier et l'url déposée
        //ajouterSignet(id, url);
        ajouterSignet(id, url, titre.innerText);
      }
    );    
    //Alternative sans ls titres
    //ajouterSignet(id, url, 'titres à venir');
  }

  function gererDragLeave(evt) {
    setDropzone(false);
  }

  function ajouterSignet(idDossier, url, titre) {
    const derniers3 = [...signets, { adresse: url, titre: titre }].slice(-3);
    signetModele.creer(utilisateur.uid, idDossier, derniers3).then(
      () => setSignets(derniers3)
    );
  }

  return (
    <article onDrop={gererDrop} onDragEnter={gererDragEnter} onDragOver={gererDragOver} onDragLeave={gererDragLeave} className={"Dossier " + (dropzone ? 'dropzone' : '') + (carteActive ? 'actif' : '')} style={{ backgroundColor: couleur }}>
      <div className="carte">
        <div className="endroit" onClick={() => setCarteActive(true)}>
          <IconButton className="deplacer" aria-label="déplacer" disableRipple={true}>
            <SortIcon />
          </IconButton>
          <div className="couverture">
            <img src={couverture || couvertureDefaut} alt={titre} />
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
        </div>
        <div className="envers">
          {
            signets.map((signet, position) => <a href={signet.adresse} key={position}>{signet.titre}</a>)
          }
          <ButtonUnstyled onClick={() => setCarteActive(false)} className="tournerCarte">
            <CloseIcon/>
          </ButtonUnstyled>
        </div>
      </div>
      <FrmDossier ouvert={ouvertForm} setOuvert={setOuvertForm} id={id} titre_p={titre} couleur_p={couleur} couverture_p={couverture} gererActionDossier={modifierDossier} />
    </article>
  );
}