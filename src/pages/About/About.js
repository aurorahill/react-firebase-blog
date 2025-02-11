import React from "react";
import logoImg from "../../assets/bbr2.jpg";
import { Link } from "react-router-dom";
import Aside from "../../components/Aside";
import classes from "./About.module.scss";
import InfoCard from "../../components/InfoCard";
import SectionHeader from "../../components/UI/SectionHeader";

const About = () => {
  return (
    <>
      <div className={classes.about}>
        <div className={classes.about__logo}>
          <img
            src={logoImg}
            alt="Logo"
          />
        </div>
        <h1 className={classes.about__header}>
          Witaj na Błażowskim Blogu Rodzinnym!
        </h1>
        <div className={classes.about__wrapper}>
          <main className={classes.about__main}>
            <SectionHeader>Garść informacji</SectionHeader>
            <InfoCard title="Cześć ✨">
              <p>
                Dzięki, że poświęciłeś swój czas i tu zajrzałeś! Niezależnie czy
                masz już konto, czy jeszcze nie, zawsze możesz być na bieżąco z
                naszymi newsami. Zapraszamy do <Link to="/">lektury</Link>!
              </p>
            </InfoCard>
            <InfoCard title="Załóż konto ✅">
              <p>
                Jeżeli masz czas i chęć, by przetestować bloga, dodawać swoje
                wpisy, komentować i lajkować wszystkie newsy{" "}
                <Link to="/auth">załóż konto</Link>!
              </p>
            </InfoCard>
            <InfoCard title="Dane osobowe ✏️">
              <p>
                Imię i nazwisko służy tylko po to, by rozpoznać autora bloga -
                możesz pisać pod pseudonimem ☺️ Email służy do logowania i
                resetowania hasła w razie potrzeby. Nie będzie żadnego
                spamowania skrzynki odbiorczej. Oczywiście w każdej chwili
                możesz usunąć swoje konto i wszystkie blogi.
              </p>
            </InfoCard>
            <InfoCard title="Informacja zwrotna 📧">
              <p>
                Czytaj, pisz, komentuj, lajkuj, usuwaj, psuj i koniecznie
                odezwij się na{" "}
                <a href="mailto:katarzyna.lubecka93@gmail.com">
                  katarzyna.lubecka93@gmail.com
                </a>
                , gdy coś nie działa lub zachowuje się inaczej niż byś
                oczekiwał. Przyjmuję każdą KONSTRUKTYWNĄ krytykę!
              </p>
            </InfoCard>
          </main>
          <Aside />
        </div>
      </div>
    </>
  );
};

export default About;
