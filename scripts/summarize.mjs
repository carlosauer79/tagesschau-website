import { GoogleGenerativeAI } from "@google/generative-ai";
import { Resend } from "resend";
import Parser from "rss-parser";
import fs from "fs";

const parser = new Parser();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

async function run() {
  console.log("Prüfe auf neue Tagesschau-Videos...");
  
  // 1. Hole das neueste Video aus der Tagesschau-Playlist via RSS
  const feed = await parser.parseURL('https://www.youtube.com/feeds/videos.xml?playlist_id=PL4A2F331EE86DCC22');
  const latestVideo = feed.items[0]; 
  const videoUrl = latestVideo.link;
  const videoTitle = latestVideo.title;

  // Prüfen, ob wir dieses Video schon verarbeitet haben
  const dbPath = './public/data.json';
  let data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  if (data.find(v => v.id === latestVideo.id)) {
    console.log("Kein neues Video gefunden. Beende Script.");
    return;
  }

  console.log(`Neues Video gefunden: ${videoTitle}. Analysiere mit Gemini 3.1 Flash-Lite...`);

  // 2. Gemini 3.1 Flash-Lite aufrufen
  const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
  
  // Da Gemini 3.1 Video-Understanding beherrscht, füttern wir den Link und den Prompt
  const prompt = `Analysiere dieses Video der Tagesschau: ${videoUrl}. 
    Erstelle eine strukturierte Zusammenfassung der Themen. 
    Beschreibe außerdem die visuelle Darstellung (was sieht man im Studio, welche Grafiken werden eingeblendet?). 
    Antworte auf Deutsch.`;

  const result = await model.generateContent(prompt);
  const summary = result.response.text();

  // 3. Ergebnis in der JSON-Datei speichern
  const newEntry = {
    id: latestVideo.id,
    date: new Date().toISOString(),
    title: videoTitle,
    url: videoUrl,
    summary: summary
  };
  
  data.unshift(newEntry); // Neues Video ganz nach oben
  fs.writeFileSync(dbPath, JSON.stringify(data.slice(0, 10), null, 2)); // Nur die letzten 10 speichern

  // 4. E-Mail via Resend senden
  console.log("Sende E-Mail...");
  await resend.emails.send({
    from: 'Tagesschau-Bot <onboarding@resend.dev>',
    to: process.env.MY_EMAIL,
    subject: `KI-Zusammenfassung: ${videoTitle}`,
    html: `<h3>${videoTitle}</h3><p>${summary.replace(/\n/g, '<br>')}</p><br><a href="${videoUrl}">Video auf YouTube öffnen</a>`
  });

  console.log("Fertig! Website-Daten aktualisiert und E-Mail verschickt.");
}

run().catch(console.error);