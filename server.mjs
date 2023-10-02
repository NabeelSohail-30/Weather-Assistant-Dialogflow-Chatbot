import express from "express";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import dialogflow from "dialogflow";
import { WebhookClient } from "dialogflow-fulfillment";

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.get("/ping", (req, res) => {
  res.send("ping back");
});

const port = process.env.PORT || 5001;

/*---------------------APIs--------------------------*/

app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;
    const intentName = body.queryResult.intent.displayName;
    const params = body.queryResult.parameters;

    switch (intentName) {
      case "Default Welcome Intent": {
        res.send({
          fulfillmentMessages: [
            {
              text: {
                text: [
                  "Hello! 👋 Welcome to Weather Assistant Chatbot. How can I assist you with the weather today?",
                ],
              },
            },
          ],
        });
        break;
      }

      case "cityWeather": {
        let city = params.city;

        const weatherData = queryWeather(city);
        res.send({
          fulfillmentMessages: [
            {
              text: {
                text: [
                  `The temperature in ${city} is ${weatherData.temperature}°C, and it's ${weatherData.condition}.`,
                ],
              },
            },
          ],
        });
        break;
      }

      case "Default Fallback Intent": {
        res.send({
          fulfillmentMessages: [
            {
              text: {
                text: ["Sorry, I didn't get that. Please try again."],
              },
            },
          ],
        });
        break;
      }

      default: {
        res.send({
          fulfillmentMessages: [
            {
              text: {
                text: ["Sorry, I didn't get that. Please try again."],
              },
            },
          ],
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.send({
      fulfillmentMessages: [
        {
          text: {
            text: ["Something is wrong with the server. Please try again."],
          },
        },
      ],
    });
  }
});

const queryWeather = async (cityName) => {
  const apiKey = "6a6cb112b4746fd1d963422db62a0782";
  const apiUrl = "https://api.openweathermap.org/data/2.5/";

  const url = `${apiUrl}weather?q=${cityName}&appid=${apiKey}&units=metric`;
  const response = await fetch(url);
  const jsonResponse = await response.json();
  console.log(jsonResponse);
  const weatherData = {
    condition: jsonResponse.weather[0].main,
    temperature: jsonResponse.main.temp,
  };

  return weatherData;
};

/*---------------------Static Files--------------------------*/

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
