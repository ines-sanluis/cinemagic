/*
  COMPLETITION:
    An OpenAI "completion" is the generated text that the model returns in response to a provided prompt.
    The generated completion is influenced by several parameters such as 'temperature', 'max_tokens', and 'top_p'.
    The completion is obtained by making an API call with the desired parameters and the input prompt.

  TOKENS:
    The GPT family of models process text using tokens, which are common sequences of characters found in text.
    One token generally corresponds to ~4 characters in English.
    https://platform.openai.com/tokenizer tool to understand how text is tokenized.
*/


// Import the necessary classes for interacting with OpenAI and making HTTP requests.
import { Configuration, OpenAIApi } from "openai";
import axios from "axios";

// Create a Configuration object with the OpenAI API key.
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
// Create an instance of OpenAI's API with the configuration.
const openai = new OpenAIApi(configuration);

// This function corresponds to API endpoint api/generate.
// Therefore, when an HTTP request is made to this endpoint, Next.js invokes this function.
export default async function (req, res) {
  // If the OpenAI API key is not configured, return a 500 error with an error message.
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }
  // Extract the input from the request.
  const input = req.body.input || '';
  // If the input is empty, return a 400 error with an error message.
  if (input.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid input",
      }
    });
    return;
  }

  try {
    // Use the OpenAI API to create a completion, using the specified model and prompt.
    const completion = await openai.createCompletion({
      model: "text-davinci-003", // ID of the model to use.
      prompt: generatePrompt(input), // The prompt to generate completions for.
      temperature: 0.6, // Models the randomness and thus the creativity of the completions. 0 = deterministic, 1 = very creative.
      max_tokens: 1000, // The maximum number of tokens to generate in the completion.
    });

    // Parse the first choice's text from the completion's data as a JavaScript array.
    const movieArray = JSON.parse(completion.data.choices[0].text);

    // Create an array of promises, each one representing a request to TMDB's search API for data about a movie.
    const movieDataPromises = movieArray.map(async (movie) => {
      const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${movie}`);
      return response.data.results[0]; // Return the first result from the response's data.
    });

    // Wait for all of the promises to resolve and collect the resulting movie data.
    const movieData = await Promise.all(movieDataPromises);

    // Send a successful response with the movie data.
    res.status(200).json({ result: movieData });

  } catch(error) {
    // If there's an error during the completion creation or data collection,
    // send an error response with the status and data from the error's response (if it exists), or with a generic message.
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


// This function generates the text to be used as a prompt for the OpenAI API call.
// The prompt is a set of instructions that the model will follow when generating the text completion.
// In this case, the prompt instructs the model to generate a JavaScript array of up to 10 movie titles that best match the user's input,
// and if the model is unable to do so, to return a specific error message.
// It also provides an example of what the input and output should look like.
function generatePrompt(input) {
  return `Create a valid JavaScript array of movie titles that best match this search term ordered from most to least relevant.
    Generate up to 9 titles.
    The response must be a valid array. Do not escape the double quotes in the output

    Example:
    prompt: "movies with brando"

    response: ["The Godfather", "On the Waterfront", "A Streetcar Named Desire", "The Godfather Part II", "Apocalypse Now"]
    prompt: ${input}
    response:
  `;
}
