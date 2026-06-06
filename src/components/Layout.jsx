import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

export default function Layout() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
