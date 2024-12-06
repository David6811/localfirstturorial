"use client"
import dynamic from "next/dynamic";
const Note = dynamic(()=>import("./components/Note"),{ssr: false})

export default function Home() {
  return (
    <div>
      <Note />
    </div>
  );
}
