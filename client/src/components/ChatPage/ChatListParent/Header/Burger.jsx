import React from "react";
import styles from "./Burger.module.scss";


const Burger = props => {
  const handleLogoutClick = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("hashedPassword");
    props.setActualPage(0);
  };

  const handleChangeThemeClick = () => props.changeTheme();

  const classesNames = {
    burger:
      "mx-2 burger " +
      (props.theme === "dark" ? styles.burgerDark : styles.burger),
    dropdownToggle: "nav-link dropdown-toggle " + styles.dropdownToggle,
    navbarDropdown:
      "dropdown-menu " +
      (props.theme === "dark" ? styles.dropdownMenuDark : styles.dropdownMenu)
  };

  return (
    <div className={classesNames.burger} alt="Gear">
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <div className="navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item dropdown">
                <a
                  className={classesNames.dropdownToggle}
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-bars" />
                </a>
                <ul
                  className={classesNames.navbarDropdown}
                  aria-labelledby="navbarDropdown"
                >
                  <li>
                    <a
                      className="dropdown-item change-theme"
                      onClick={handleChangeThemeClick}
                      href="#"
                    >
                      Change theme
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a
                      className="dropdown-item logout"
                      onClick={handleLogoutClick}
                      href="#"
                    >
                      Logout
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Burger;
