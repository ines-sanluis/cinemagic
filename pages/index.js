import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import { IoSend } from 'react-icons/io5';
import {BiLoaderAlt} from 'react-icons/bi';

export default function Home() {
  // This state variable holds the input from the user.
  const [input, setInput] = useState("");
  // This state variable holds the movies fetched from the API.
  const [assets, setAssets] = useState();
  // This state variable holds a boolean that represents whether the app is currently loading data from the API.
  const [isLoading, setIsLoading] = useState(false);
  // This state variable holds error messages and the function to update them.
  const [errorMessage, setErrorMessage] = useState("");

  async function onSubmit(event) {
    // This prevents the default form submission behavior, which would refresh the page.
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    try {
      // We use fetch to make a POST request to our own API at /api/generate
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: input }),
      });

      const data = await response.json();
      // Handle errors from the API.
      if (response.status !== 200) {
        console.error(response.status, data);
        setErrorMessage("Sorry! It seems like something went wrong. Please wait a minute and try again!");
      }
      if (data.result.length === 0) {
        setErrorMessage("Sorry! Our AI is not that great yet and found no results but you can try again!")
      } else {
        setAssets(data.result); // Store the data in the state variable.
      }
      setIsLoading(false);
    } catch(error) {
      console.error(error);
      setErrorMessage("Sorry! It seems like something went wrong. Please wait a minute and try again!");
      setIsLoading(false);
    }
  }

  return (
    // The return of our functional component specifies what is rendered to the DOM.
    <div className={styles.container}>
      <Head>
        <title>CineMagic - Movie discovery </title>
        <meta name="description" content="Welcome to CineMagic, your magical cinema search experience." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {/* Hero */}
        <section className={styles.hero}>
          <h1 className={styles.title}>🎬 CineMagic 🪄</h1>
          <h2 className={styles.subtitle}>Where movie discovery meets AI</h2>
          <p className={styles.description}>
            Our unique search feature powered by GPT allows you to find films by plot, actor, or even your current mood!
            Dive into the magic of cinema with CineMagic
          </p>
        </section>
        {/* Search Bar */}
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
              {isLoading ? <BiLoaderAlt className={styles.spinIcon} /> : <IoSend/>}
            </button>
          </form>
        </section>
        {/* Loading Skeleton */}
        {isLoading && <section className={styles.loading}>
          {[...Array(10)].map((_, index) => {
            return <div key={index} className={styles.loadingMovie} />
          })}
        </section>}
        {/* Movies */}
        {!isLoading && assets && <section className={styles.movies}>
          {assets.map((movie, index) => {
            if (movie) {
              return <div key={index} className={styles.movie}>
              {movie.poster_path && (
                <a href={`https://www.themoviedb.org/movie/${movie.id}`} target="_blank" rel="noopener noreferrer">
                  <img
                    className={styles.moviePoster}
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={`Poster for ${movie.title}`}
                  />
                </a>
              )}
              <div className={styles.movieDetails}>
                <h2>{movie.title}</h2>
                <span className={styles.year}>{movie.release_date && movie.release_date.substring(0, 4)}</span>
                <p className={styles.overview}>{movie.overview}</p>
              </div>
            </div>
            }
          })}
        </section>}
        {/* Error Message */}
        {errorMessage && <div className={styles.errorContainer}>
          <p className={styles.error}>
            {errorMessage}
          </p>
        </div>}
        {/* Footer */}
        <footer className={styles.footer}>
          <p>© 2023 CineMagic. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
