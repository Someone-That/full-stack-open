sequenceDiagram
    participant browser
    participant server

    browser->>browser: adds new note to locally stored notes list with notes.push(note)
    browser->>browser: re-renders the notes with the updated notes

    Note right of browser: sends the new note to the server
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa