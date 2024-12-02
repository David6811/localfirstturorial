"use client"
import styles from "./page.module.css";
import dynamic from "next/dynamic";
const Note = dynamic(()=>import("./components/Note"),{ssr: false})

export default function Home() {
  return (
    <div className={styles.page}>
      <Note />
    </div>
  );
}
