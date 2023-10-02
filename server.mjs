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
                  "Hello There, Welcome to SAF Collegiate. How can I help you?",
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
                text: [
                  "Sorry, I didn't get that. Please try again or contact us at 0300-1234567",
                ],
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
                text: [
                  "Sorry, I didn't get that. Please try again or contact us at 0300-1234567",
                ],
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
            text: ["something is wrong in server, please try again"],
          },
        },
      ],
    });
  }
});

/*---------------------Static Files--------------------------*/

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});