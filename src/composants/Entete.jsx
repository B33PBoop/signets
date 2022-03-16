import './Entete.scss';
import Avatar from '@mui/material/Avatar';
import avatarImg from '../images/google-logo.png';

export default function Entete() {
  return (
    <header className="Entete">
      <div className="logo">Signets</div>
      <div className="utilisateur">
        Camille Semaan 
        <Avatar className="avatar" alt="Camille Semaan" src={avatarImg} />
      </div>
    </header>
  );
}