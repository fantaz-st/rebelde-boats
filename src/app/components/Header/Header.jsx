import classes from "./Header.module.css";

const Header = () => {
  return (
    <div className={classes.container}>
      <div className={classes.logo}>
        <a href='#'>
          <span>R</span>BD
        </a>
      </div>
      <div className={classes.contactUs}>
        <a href="https://wa.me/385997973959?text=Hi,%20I'm%20interested%20in%20renting%20your%20boat!" className={classes.contactUs}>
          <img src='./assets/WhatsAppButtonGreenSmall.svg' alt='whatsapp chat button' />
        </a>
      </div>
    </div>
  );
};

export default Header;
