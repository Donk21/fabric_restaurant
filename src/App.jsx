import { useCallback, useState } from "react";
import { useNow } from "./hooks/useNow.js";
import GearSprite from "./components/GearSprite.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Menu from "./components/Menu.jsx";
import Hours from "./components/Hours.jsx";
import Booking from "./components/Booking.jsx";
import Contacts from "./components/Contacts.jsx";
import Footer from "./components/Footer.jsx";
import BookingModal from "./components/BookingModal.jsx";

export default function App() {
  const now = useNow();
  const [booking, setBooking] = useState(null);

  const handleSubmitted = useCallback((data, sent) => setBooking({ data, sent }), []);
  const closeModal = useCallback(() => setBooking(null), []);

  return (
    <>
      <GearSprite />
      <Header />
      <main>
        <Hero now={now} />
        <About />
        <Menu />
        <Hours now={now} />
        <Booking onSubmitted={handleSubmitted} />
        <Contacts />
      </main>
      <Footer year={now.getFullYear()} />
      <BookingModal booking={booking} onClose={closeModal} />
    </>
  );
}
