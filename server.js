import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});



app.get("/pictures/defaultpfp", (req, res) => {
  res.sendFile(path.join(__dirname, "public/img", "barbosapfp1.png"));
});

app.get("/pictures/file-organizer", (req, res) => {
  res.sendFile(path.join(__dirname, "public/img", "file-organizer.png"));
});

app.get("/pictures/youtube", (req, res) => {
  res.sendFile(path.join(__dirname, "public/img", "youtube.png"));
});

app.get("/pictures/tiktok", (req, res) => {
  res.sendFile(path.join(__dirname, "public/img", "tiktok.png"));
});

app.get("/pictures/github", (req, res) => {
  res.sendFile(path.join(__dirname, "public/img", "github.png"));
});

app.use((req, res) => {
    res.redirect("/");
});

app.listen(3000, () => {
  console.log("Portifólio iniciado." );
});

