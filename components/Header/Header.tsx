"use client";

import Link from "next/link";
import styles from "./Header.module.css";

/**
 * Компонент шапки застосунку.
 * Містить логотип та основну навігацію.
 */
export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" aria-label="Home" className={styles.logo}>
        NoteHub
      </Link>

      <nav aria-label="Main navigation">
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link href="/">Home</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/notes">Notes</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
