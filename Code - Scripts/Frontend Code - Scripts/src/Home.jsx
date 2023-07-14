import React from 'react'
import InputGroupSongSearch from "./components/InputGroupSongSearch";
import "./App.css";

function Home() {
  return (
    <div>
      <h1 className="header">Song Lyrics Translator</h1>
      <br />
      <div class="col text-center">
        {/*
          
          <Button class="button_translate_by_search" variant="primary" onClick={collapseSearchMenu}>
            Search Song
          </Button>{" "}
          <Button class="button_translate_by_lyrics" variant="success" onClick={collapseLyricsMenu}>
            Search by Lyrics
          </Button>{" "}
          */}
      </div>

      <br />
      <InputGroupSongSearch class="search-by-song"></InputGroupSongSearch>
    </div>
  );
}

export default Home