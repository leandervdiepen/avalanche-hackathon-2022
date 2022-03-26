import styles from "../styles/Layout.module.css";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const openMenu = () => {
    setOpen(!open);
  };
  const [walletConnected, setWalletConnected] = useState(false);
  return (
    <>
      <header className={styles.header}>
        <nav className={styles.navbar}>
          <Link href="/" className={styles.navlogo}>
            <Image
              alt="Logo multichain NFT Marketplace"
              src={"/../public/images/logo.jpg"}
              width={64}
              height={64}
            />
          </Link>
          <ul
            className={
              open === false
                ? styles.navmenu
                : styles.navmenu + " " + styles.active
            }
          >
            <li className={styles.navitem}>
              <Link href="/connect" className={styles.navlink}>
                Connect Wallet
              </Link>
            </li>
            {walletConnected && (
              <li className={styles.navitem}>
                <Link
                  className="text-xl font-normal my-4"
                  href="/create"
                  onClick={() =>
                    setTimeout(() => {
                      setOpen(!open);
                    }, 100)
                  }
                >
                  Create
                </Link>
              </li>
            )}
          </ul>
          <button
            className={
              open === false
                ? styles.hamburger
                : styles.hamburger + " " + styles.active
            }
            onClick={openMenu}
          >
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
          </button>
        </nav>
      </header>
      {children}
      {/* footer */}
    </>
  );
}
