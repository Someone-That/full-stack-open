sequenceDiagram
    participant browser
    participant server

    Note right of browser: User hit the save button
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    Note left of server: Server processes the new note and adds it to the list of notes
    activate server
    server-->>browser: Redirect/reload the notes page with the updated notes
    deactivate server