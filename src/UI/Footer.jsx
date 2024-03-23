import styled from "styled-components";
import styles from "./Footer.module.css";
import electronicsLogo from "../images/electronics-logo.png";
import { Link } from "react-router-dom";

const StyledFooter = styled.footer`
  padding: 4rem 0;
  border-top: 1px solid #eee;
  grid-column: 1 / -1;
`;

function Footer() {
  return (
    <StyledFooter>
      <div
        className={`${styles.container} ${styles.grid} ${styles["grid--footer"]}`}
      >
        <div className={styles["logo-col"]}>
          <Link className={styles["footer-logo"]} to="#">
            <img
              className={styles.logo}
              alt="ElectroniX logo"
              src={electronicsLogo}
            />
          </Link>
        </div>
        <div className={styles["address-col"]}>
          <p className={styles["footer-heading"]}>Contact us</p>
          <address className={styles.contacts}>
            <p className={styles.address}>
              Strada Târgu Neamț 4, București 062056
            </p>
            <p>
              <Link className={styles["footer-link"]} to="tel:0749133578">
                0749133578
              </Link>
              <br />
              <Link
                className={styles["footer-link"]}
                to="mailto:hello@electronix.com"
              >
                hello@electronix.com
              </Link>
            </p>
          </address>
        </div>
        <nav className={styles["nav-col"]}>
          <p className={styles["footer-heading"]}>Account</p>
          <ul className={styles["footer-nav"]}>
            <li>
              <Link
                className={styles["footer-link"]}
                to="/electronix/form=signup"
              >
                Create account
              </Link>
            </li>
            <li>
              <Link
                className={styles["footer-link"]}
                to="/electronix/form=login"
              >
                Sign in
              </Link>
            </li>
          </ul>
        </nav>

        <nav className={styles["nav-col"]}>
          <p className={styles["footer-heading"]}>Company</p>
          <ul className={styles["footer-nav"]}>
            <li>
              <Link className={styles["footer-link"]} to="/electronix/about">
                About ElectroniX
              </Link>
            </li>
            <li>
              <Link
                className={styles["footer-link"]}
                to="/electronix/forbusiness"
              >
                For Business
              </Link>
            </li>
          </ul>
        </nav>

        <nav className={styles["nav-col"]}>
          <p className={styles["footer-heading"]}>Resources</p>
          <ul className={styles["footer-nav"]}>
            <li>
              <Link className={styles["footer-link"]} to="#">
                Help center
              </Link>
            </li>
            <li>
              <Link
                className={styles["footer-link"]}
                to="/electronix/privacyterms"
              >
                Privacy & terms
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <p className={styles.copyright}>
        Copyright &copy; 2024 by ElectroniX, Inc. All rights reserved.
      </p>
    </StyledFooter>
  );
}

export default Footer;
