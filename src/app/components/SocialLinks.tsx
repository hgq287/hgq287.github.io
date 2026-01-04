import styles from '../../styles/Header.module.css';
import { SiGithub, SiLinkedin, SiStackoverflow, SiX } from 'react-icons/si';

export const SocialLinks = () => (
  <div className={styles.socialGroup}>
    <a href="https://github.com/hgq287" target='_blank' rel="noopener noreferrer" className={styles.socialIcon}><SiGithub size={15} /></a>
    <a href="https://www.linkedin.com/in/hgq287" target='_blank' rel="noopener noreferrer" className={styles.socialIcon}><SiLinkedin size={15} /></a>
    <a href="https://stackoverflow.com/users/12345813/hgq287" target='_blank' rel="noopener noreferrer" className={styles.socialIcon}><SiStackoverflow size={15} /></a>
  </div>
);