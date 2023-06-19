import { Configuration, OpenAIApi } from "openai";
import axios from "axios";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const input = req.body.input || '';
  if (input.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid input",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(input),
      temperature: 0.6,
      max_tokens: 1000,
      top_p: 1
    });
    const movieArray = JSON.parse(completion.data.choices[0].text);
    const movieDataPromises = movieArray.map(async (movie) => {
      const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${movie}`);
      return response.data.results[0];
    });

    const movieData = await Promise.all(movieDataPromises);
    res.status(200).json({ result: movieData });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(input) {
  return `Create a valid JavaScript array of movie titles that best match this search term ordered from most to least relevant.
    Generate up to 10 titles.
    If you are unable to answer the question, return a string that starts with Sorry.
    The response must be a valid array. Do not escape the double quotes in the output

    Example:
    prompt: "movies with brando"

    response: ["The Godfather", "On the Waterfront", "A Streetcar Named Desire", "The Godfather Part II", "Apocalypse Now"]
    prompt: ${input}
    response:
  `;
}
