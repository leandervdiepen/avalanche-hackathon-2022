import styles from "../styles/Layout.module.css";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { hooks } from "../connectors/coinbase";
import {hooks as metamaskHooks} from "../connectors/metamask";

// const { useIsActive } = hooks;
const { useIsActive } = metamaskHooks;
export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const openMenu = () => {
    setOpen(!open);
  };
  // const isActiveCoinbase = useIsActive();
  const isActive = useIsActive()
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
            {!isActive && (
              <li className={styles.navitem}>
                <Link href="/connect" className={styles.navlink}>
                  Connect Wallet
                </Link>
              </li>
            )}
            {isActive && (
              <span className="flex flex-row">
                <li className={styles.navitem}>
                  <Link
                    className="text-xl font-normal my-4"
                    href="/swapandtransfer"
                    onClick={() =>
                      setTimeout(() => {
                        setOpen(!open);
                      }, 100)
                    }
                  >
                    Create
                  </Link>
                </li>
                <li className={styles.navitem}>
                  <Link
                    className="text-xl font-normal my-4"
                    href="/swapandtransfer"
                    onClick={() =>
                      setTimeout(() => {
                        setOpen(!open);
                      }, 100)
                    }
                  >
                    Transfer
                  </Link>
                </li>
                <li>
                  <button onClick={() => void connector.deactivate()}>
                    <Image
                      src={"/../styles/icons/logout.svg"}
                      width={50}
                      height={50}
                    />
                  </button>
                </li>
              </span>
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
