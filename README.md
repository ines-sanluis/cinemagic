# CineMagic

This project involved creating a proof of concept (POC) for a GPT-powered search bar within an OTT app, showcasing the potential of intelligent movie search and discovery.

This is an example pet name generator app used in the OpenAI API [quickstart tutorial](https://platform.openai.com/docs/quickstart). It uses the [Next.js](https://nextjs.org/) framework with [React](https://reactjs.org/). Check out the tutorial or follow the instructions below to get set up.

It also uses OpenAI API [quickstart tutorial](https://platform.openai.com/docs/quickstart) as well as [TMDB API](https://developer.themoviedb.org/reference/intro/getting-started). You must set your API keys in a `.env` file.

## Setup

1. If you don’t have Node.js installed, [install it from here](https://nodejs.org/en/) (Node.js version >= 14.6.0 required)

2. Clone this repository

3. Navigate into the project directory

   ```bash
   $ cd cinemagic
   ```

4. Install the requirements

   ```bash
   $ npm install
   ```

5. Make a copy of the example environment variables file

   On Linux systems: 
   ```bash
   $ cp .env.example .env
   ```
   On Windows:
   ```powershell
   $ copy .env.example .env
   ```
6. Add your [API key](https://platform.openai.com/account/api-keys) to the newly created `.env` file for Open AI as well as for [TMDB](https://developer.themoviedb.org/reference/intro/getting-started).

7. Run the app

   ```bash
   $ npm run dev
   ```

You should now be able to access the app at [http://localhost:3000](http://localhost:3000)! For the full context behind this example app, check out the [tutorial](https://platform.openai.com/docs/quickstart).
