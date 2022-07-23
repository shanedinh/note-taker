const fs = require('fs');
const path = require('path');
const express = require('express');
const notesdb = require('./db/db.json');

const PORT = process.env.PORT || 3003;
const app = express();

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
// make publice files readilly available
app.use(express.static('public'));

// POST routes
app.post('/api/notes', (req, res) => {
    console.log('/api/notes post was hit');
    let note = req.body;
    let noteList = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    let length = noteList.length;
    
    note.id = length;
    noteList.push(note);
    fs.writeFileSync('./db/db.json', JSON.stringify(noteList));
    res.json(noteList);
});

// GET routes
// return the index file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// return the notes html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// return the db.json file
app.get('/api/notes', (req, res) => {
    let db = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    res.json(db);
});

// return index html for any other urls
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// delete route
app.delete('/api/notes/:id', (req, res) => {
    let noteId = req.params.id;
    let noteList = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));

    noteList = noteList.filter(note => {
        return note.id != noteId;
    })

    fs.writeFileSync('./db/db.json', JSON.stringify(noteList));
    res.json(noteList);
});


app.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`);
});