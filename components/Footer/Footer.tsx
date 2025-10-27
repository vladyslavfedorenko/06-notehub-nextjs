"use client";

import styles from "./Footer.module.css";

/**
 * Компонент футера застосунку.
 * Містить авторські дані та контактну інформацію.
 */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <p>© {new Date().getFullYear()} NoteHub. All rights reserved.</p>

        <div className={styles.wrap}>
          <p>Developer: Your Name</p>
          <p>
            Contact us:{" "}
            <a href="mailto:student@notehub.app" className={styles.link}>
              student@notehub.app
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
