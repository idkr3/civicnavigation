import "dotenv/config";
import express from "express";
import nodemailer from "nodemailer";
import Stripe from "stripe";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5174;
const siteUrl = process.env.SITE_URL || `http://127.0.0.1:${port}`;

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

const prices = {
  youth: {
    name: "KYRO Youth Tournament Registration",
    unitAmount: 500,
  },
  adult: {
    name: "KYRO Adult Tournament Registration",
    unitAmount: 1000,
  },
};

function getDivisionType(division = "") {
  return division.toLowerCase().includes("adult") ? "adult" : "youth";
}

function makeTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendConfirmationEmail(session) {
  const transporter = makeTransporter();
  const metadata = session.metadata || {};
  const to = session.customer_details?.email || metadata.email;
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;

  if (!to) {
    console.warn("Paid session had no email address:", session.id);
    return;
  }

  const message = {
    from,
    to,
    subject: "KYRO Pickleball registration confirmed",
    text: [
      `Hi ${metadata.name || "there"},`,
      "",
      "Your KYRO Pickleball tournament registration is confirmed.",
      "",
      `Ticket ID: ${metadata.ticketCode || session.id}`,
      `Division: ${metadata.division || "Selected division"}`,
      `Event: ${metadata.event || "Selected event"}`,
      `Skill level: ${metadata.skill || "Selected skill level"}`,
      `Amount paid: $${((session.amount_total || 0) / 100).toFixed(2)}`,
      "",
      "Please bring your paddle, court shoes, water, and this confirmation to check-in.",
      "",
      "See you on the court,",
      "KYRO Pickleball",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.5;">
        <h2 style="margin: 0 0 12px;">You're in.</h2>
        <p>Hi ${metadata.name || "there"}, your KYRO Pickleball tournament registration is confirmed.</p>
        <table style="border-collapse: collapse; margin: 18px 0;">
          <tr><td style="padding: 6px 12px 6px 0; color: #666;">Ticket ID</td><td><strong>${metadata.ticketCode || session.id}</strong></td></tr>
          <tr><td style="padding: 6px 12px 6px 0; color: #666;">Division</td><td>${metadata.division || "Selected division"}</td></tr>
          <tr><td style="padding: 6px 12px 6px 0; color: #666;">Event</td><td>${metadata.event || "Selected event"}</td></tr>
          <tr><td style="padding: 6px 12px 6px 0; color: #666;">Skill level</td><td>${metadata.skill || "Selected skill level"}</td></tr>
          <tr><td style="padding: 6px 12px 6px 0; color: #666;">Amount paid</td><td>$${((session.amount_total || 0) / 100).toFixed(2)}</td></tr>
        </table>
        <p>Please bring your paddle, court shoes, water, and this confirmation to check-in.</p>
        <p>See you on the court,<br>KYRO Pickleball</p>
      </div>
    `,
  };

  if (!transporter) {
    console.log("Email not sent because SMTP is not configured. Preview:", message);
    return;
  }

  await transporter.sendMail(message);
}

app.post(
  "/api/stripe-webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    if (!stripe || !stripeWebhookSecret) {
      response.status(500).send("Stripe webhook is not configured.");
      return;
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        request.headers["stripe-signature"],
        stripeWebhookSecret,
      );
    } catch (error) {
      response.status(400).send(`Webhook Error: ${error.message}`);
      return;
    }

    if (event.type === "checkout.session.completed") {
      try {
        await sendConfirmationEmail(event.data.object);
      } catch (error) {
        console.error("Failed to send confirmation email:", error);
      }
    }

    response.json({ received: true });
  },
);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/create-checkout-session", async (request, response) => {
  if (!stripe) {
    response.status(500).json({ error: "Stripe is not configured. Add STRIPE_SECRET_KEY to .env." });
    return;
  }

  const { name, age, email, phone, division, event, skill, updates } = request.body;

  if (!name || !age || !email || !phone || !division || !event || !skill) {
    response.status(400).json({ error: "Missing required registration details." });
    return;
  }

  const divisionType = getDivisionType(division);
  const price = prices[divisionType];
  const ticketCode = `KYRO-${Date.now().toString().slice(-6)}`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: price.name,
              description: `${division} / ${event} / ${skill}`,
            },
            unit_amount: price.unitAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        ticketCode,
        name,
        age: String(age),
        email,
        phone,
        division,
        event,
        skill,
        updates: updates ? "yes" : "no",
      },
      success_url: `${siteUrl}/?checkout=success&ticket=${encodeURIComponent(ticketCode)}`,
      cancel_url: `${siteUrl}/?checkout=cancelled`,
    });

    response.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    response.status(500).json({ error: "Unable to start Stripe Checkout." });
  }
});

app.get("*", (_request, response) => {
  response.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`KYRO site running at ${siteUrl}`);
});
