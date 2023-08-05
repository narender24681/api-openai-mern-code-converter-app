const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = 8080;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.use(cors());
app.use(bodyParser.json());

// API endpoint for code conversion
app.post("/api/convert", async (req, res) => {
  try {
    const { code, language } = req.body;
    const result = await callOpenAIConversionAPI(code, language);
    console.log(result);
    res.json({ result });
  } catch (error) {
    console.error("Error converting code:", error.message);
    res.status(500).json({ error: "Error converting code." });
  }
});

// API endpoint for code debugging
app.post("/api/debug", async (req, res) => {
  try {
    const { code } = req.body;
    const debuggedCode = await callOpenAIDebugAPI(code);
    res.json({ debuggedCode });
  } catch (error) {
    console.error("Error debugging code:", error.message);
    res.status(500).json({ error: "Error debugging code." });
  }
});

// API endpoint for code quality assessment
app.post("/api/quality", async (req, res) => {
  try {
    const { code } = req.body;
    const qualitySummary = await callOpenAIQualityAPI(code);
    res.json({ qualitySummary });
  } catch (error) {
    console.error("Error getting code quality report:", error.message);
    res.status(500).json({ error: "Error getting code quality report." });
  }
});

async function callOpenAIConversionAPI(code, language) {
  const prompt = `Convert this ${language} code:\n\n${code}`;
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    max_tokens: 200,
    temperature: 0.7,
  });
  return response.data.choices[0].text;
}

async function callOpenAIDebugAPI(code) {
  const prompt = `Debug this code:\n\n${code}`;
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    max_tokens: 200,
    temperature: 0.7,
  });
  return response.data.choices[0].text;
}

async function callOpenAIQualityAPI(code) {
  const prompt = `Assess code quality:\n\n${code}`;
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    max_tokens: 200,
    temperature: 0.7,
  });
  return response.data.choices[0].text;
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
