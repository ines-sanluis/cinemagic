import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import { IoSend } from 'react-icons/io5';
import {IoEllipsisHorizontal} from 'react-icons/io5';

export default function Home() {
  const [input, setInput] = useState("");
  const [assets, setAssets] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: input }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        setErrorMessage("Sorry! It seems like something went wrong. Please wait a minute and try again!");
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      if (data.result.length === 0) {
        setErrorMessage("Sorry! Our AI is not that great yet and found no results but you can try again!")
      } else {
        setAssets(data.result);
      }
      setIsLoading(false);
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>CineMagic</title>
        <meta name="description" content="Welcome to CineMagic, your magical cinema search experience." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>⭐ CineMagic 🪄</h1>
          <h2 className={styles.subtitle}>Where movie discovery meets AI</h2>
          <p className={styles.description}>
            Our unique search feature powered by GPT allows you to find films by plot, actor, or even your current mood!
            Dive into the magic of cinema with CineMagic
          </p>
        </section>
        <section className={styles.search}>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              name="search"
              placeholder="Search a movie"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={styles.searchBar}
            />
            <button type="submit" className={styles.searchIcon}>
              {isLoading ? <IoEllipsisHorizontal /> : <IoSend />}
            </button>
          </form>
        </section>
        {assets && <section className={styles.movies}>
          {assets.map((movie, index) => {
            if (movie) {
              return <div key={index} className={styles.movie}>
              {movie.poster_path && (
                <img
                className={styles.moviePoster}
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={`Poster for ${movie.title}`}
                />
              )}
              <div className={styles.movieDetails}>
                <h2>{movie.title}</h2>
                <p>{movie.overview}</p>
              </div>
            </div>
            }
          })}
        </section>}
        {errorMessage && <p className={styles.description}>
          {errorMessage}
        </p>}
        <footer className={styles.footer}>
          <p>© 2023 CineMagic. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
