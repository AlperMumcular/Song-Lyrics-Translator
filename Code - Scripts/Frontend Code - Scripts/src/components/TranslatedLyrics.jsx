import React from "react";
import "../App.css";

function TranslatedLyrics({lyrics}) {
  return (
    <div className="translated_lyrics">
      <pre style={{ whiteSpace: "pre-line" }}>
       {lyrics}
      </pre>
    </div>
  );
}

export default TranslatedLyrics;
