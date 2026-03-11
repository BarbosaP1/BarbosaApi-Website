import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import ytdl from "@distube/ytdl-core";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/profile", "index.html"));
});


app.get("/pictures/defaultpfp", (req, res) => {
  res.sendFile(path.join(__dirname, "public/img", "barbosapfp2.png"));
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

app.get("/pictures/clipmanager1", (req, res) => {
  res.sendFile(path.join(__dirname, "public/img", "clipManager1.png"));
});

app.get("/pictures/clipmanager2", (req, res) => {
  res.sendFile(path.join(__dirname, "public/img", "clipManager2.png"));
});

app.get("/pictures/clipmanager3", (req, res) => {
  res.sendFile(path.join(__dirname, "public/img", "clipManager3.png"));
});

app.get("/pictures/clipmanager4", (req, res) => {
  res.sendFile(path.join(__dirname, "public/img", "clipManager4.png"));
});

app.get("/pictures/skin/cat-maid", (req, res) => {
  res.sendFile(path.join(__dirname, "public/img", "cat-maid_skin.png"));
});


app.get("/ping", (req, res) => {
    res.send("OK");
});

app.use((req, res) => {
    res.redirect("/");
});

app.listen(3000, () => {
  console.log("Portifólio iniciado." );
});

