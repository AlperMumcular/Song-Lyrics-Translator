import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Alert } from "react-bootstrap";
import React, { useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import axiosInstance from "./axios";

export function SongForm({ onCancelClick, type }) {
  const languagesDict = {
    'Afrikaans': 'af',
    'Albanian': 'sq',
    'Amharic': 'am',
    'Arabic': 'ar',
    'Armenian': 'hy',
    'Azerbaijani': 'az',
    'Basque': 'eu',
    'Belarusian': 'be',
    'Bengali': 'bn',
    'Bosnian': 'bs',
    'Bulgarian': 'bg',
    'Catalan': 'ca',
    'Cebuano': 'ceb',
    'Chinese': 'zh-CN',
    'Corsican': 'co',
    'Croatian': 'hr',
    'Czech': 'cs',
    'Danish': 'da',
    'Dutch': 'nl',
    'English': 'en',
    'Esperanto': 'eo',
    'Estonian': 'et',
    'Finnish': 'fi',
    'French': 'fr',
    'Frisian': 'fy',
    'Galician': 'gl',
    'Georgian': 'ka',
    'German': 'de',
    'Greek': 'el',
    'Gujarati': 'gu',
    'Haitian Creole': 'ht',
    'Hausa': 'ha',
    'Hawaiian': 'haw',
    'Hebrew': 'he',
    'Hindi': 'hi',
    'Hmong': 'hmn',
    'Hungarian': 'hu',
    'Icelandic': 'is',
    'Igbo': 'ig',
    'Indonesian': 'id',
    'Irish': 'ga',
    'Italian': 'it',
    'Japanese': 'ja',
    'Javanese': 'jv',
    'Kannada': 'kn',
    'Kazakh': 'kk',
    'Khmer': 'km',
    'Kinyarwanda': 'rw',
    'Korean': 'ko',
    'Kurdish': 'ku',
    'Kyrgyz': 'ky',
    'Lao': 'lo',
    'Latin': 'la',
    'Latvian': 'lv',
    'Lithuanian': 'lt',
    'Luxembourgish': 'lb',
    'Macedonian': 'mk',
    'Malagasy': 'mg',
    'Malay': 'ms',
    'Malayalam': 'ml',
    'Maltese': 'mt',
    'Maori': 'mi',
    'Marathi': 'mr',
    'Mongolian': 'mn',
    'Myanmar (Burmese)': 'my',
    'Nepali': 'ne',
    'Norwegian': 'no',
    'Nyanja (Chichewa)': 'ny',
    'Odia (Oriya)': 'or',
    'Pashto': 'ps',
    'Persian': 'fa',
    'Polish': 'pl',
    'Portuguese': 'pt',
    'Punjabi': 'pa',
    'Romanian': 'ro',
    'Russian': 'ru',
    'Samoan': 'sm',
    'Scots Gaelic': 'gd',
    'Serbian': 'sr',
    'Sesotho': 'st',
    'Shona': 'sn',
    'Sindhi': 'sd',
    'Sinhala': 'si',
    'Slovak': 'sk',
    'Slovenian': 'sl',
    'Somali': 'so',
    'Spanish': 'es',
    'Sundanese': 'su',
    'Swahili': 'sw',
    'Swedish': 'sv',
    'Filipino': 'tl',
    'Tajik': 'tg',
    'Tamil': 'ta',
    'Tatar': 'tt',
    'Telugu': 'te',
    'Thai': 'th',
    'Turkish': 'tr',
    'Turkmen': 'tk',
    'Ukrainian': 'uk',
    'Urdu': 'ur',
    'Uyghur': 'ug',
    'Uzbek': 'uz',
    'Vietnamese': 'vi',
    'Welsh': 'cy',
    'Xhosa': 'xh',
    'Yiddish': 'yi',
    'Yoruba': 'yo',
    'Zulu': 'zu'
  };

  const languageArray = Object.entries(languagesDict)

  const languages = languageArray.map(([language, code]) => {
    return language
  })

  const buttonText = type.charAt(0).toUpperCase() + type.slice(1);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showFailureAlert, setShowFailureAlert] = useState(false);

  const handleCancelClick = () => {
    onCancelClick(); // Call the onCancelClick callback function passed from AdminControlPage
  };
  const handleUpdateSong = () => {
    const artistName = document.getElementById("artistName").value;
    const songName = document.getElementById("songName").value;
    const songLyrics = document.getElementById("songLyrics").value;
    const language = document.getElementById("language").value;

    if(artistName!==""&&songName!==""&&songLyrics!==""&& language!=="") {
      const songData = {
        artistName: artistName,
        songName: songName,
        lyrics: songLyrics,
        language: language
      };

      axiosInstance
        .post("/update-song", songData, {headers: {Authorization: `Token ${localStorage.getItem("token")}`}})
        .then((response) => {
          console.log(response.data);
          setShowSuccessAlert(true);
        })
        .catch((error) => {
          console.log(error);
          setShowFailureAlert(true);
        });
      }
  };
  const handleAddSong = () => {
    const artistName = document.getElementById("artistName").value;
    const songName = document.getElementById("songName").value;
    const songLyrics = document.getElementById("songLyrics").value;

    if(artistName!==""&&songName!==""&&songLyrics!=="") {
      const songData = {
        artistName: artistName,
        songName: songName,
        lyrics: songLyrics,
      };

      axiosInstance
        .post("/add-song", songData, {headers: {Authorization: `Token ${localStorage.getItem("token")}`}})
        .then((response) => {
          console.log(response.data);
          setShowSuccessAlert(true);
        })
        .catch((error) => {
          console.log(error);
          setShowFailureAlert(true);
        });
      }
  };

  const handleDeleteSong = () => {
    const artistName = document.getElementById('artistName').value;
    const songName = document.getElementById('songName').value;
  
    const songData = {
      artistName: artistName,
      songName: songName,
    };
  
    axiosInstance
      .delete('/delete-song', {
        data: songData,
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        console.log(response.data.message);
        setShowSuccessAlert(true);
        setShowFailureAlert(false);
      })
      .catch((error) => {
        console.log(error.response);
        setShowSuccessAlert(false);
        if (error.response && error.response.status === 404) {
          setShowFailureAlert(true);
        } else {
          // Handle other errors (e.g., network error)
          // You can display a generic failure message or handle the error as needed
          console.log(error);
        }
      });
  };

  const handleAlert = () => {
    setShowSuccessAlert(false);
    setShowFailureAlert(false);
    if (type === "add") {
      handleAddSong();
    } else if (type === "remove") {
      handleDeleteSong();
    }
    else if (type === "update") {
      handleUpdateSong();
    }
  };

  return (
    <div>
      <div className="formContainer">
        {type === "add" && <h1>Add New Song</h1>}
        {type === "remove" && <h1>Remove Song</h1>}
        {type === "update" && <h1>Update Song</h1>}
        <br />
        <InputGroup className="mb-3">
          <InputGroup.Text
            style={{ height: "50px" }}
            id="inputGroup-sizing-default"
          >
            Song Artist
          </InputGroup.Text>
          <Form.Control
            id="artistName"
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            required
          />
        </InputGroup>
        <br />
        <InputGroup className="mb-3">
          <InputGroup.Text
            style={{ height: "50px" }}
            id="inputGroup-sizing-default"
          >
            Song Name
          </InputGroup.Text>
          <Form.Control
            id="songName"
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            required
          />
        </InputGroup>
        {(type === "update") && (
          <InputGroup className="mb-3">
            <InputGroup.Text
            style={{ height: "50px" }}
            id="inputGroup-sizing-default"
          >
            Language
          </InputGroup.Text>
          <Form.Control
            id="language"
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            required
          />
          </InputGroup>
        )}
        {(type === "add" || type === "update") && (
          <InputGroup className="mb-3">
            <InputGroup.Text
              style={{ height: "200px" }}
              id="inputGroup-sizing-default"
            >
              Song Lyrics
            </InputGroup.Text>

            <Form.Control
              id="songLyrics"
              as="textarea"
              rows={6}
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              required
            />
          </InputGroup>
        )}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            style={{ flex: "1", marginRight: "10px", height: "40px" }}
            type="submit"
            onClick={handleAlert}
            
          >
            {buttonText}
          </Button>
          <Button
            style={{ flex: "1", height: "40px" }}
            variant="danger"
            type="submit"
            onClick={handleCancelClick}
            
          >
            {" "}
            Cancel{" "}
          </Button>
        </div>

        <br></br>
        {showSuccessAlert && (
          <Alert
            variant="success"
            onClose={() => setShowSuccessAlert(false)}
            dismissible
          >
            Success.
          </Alert>
        )}
        {showFailureAlert && (
          <Alert
            variant="danger"
            onClose={() => setShowFailureAlert(false)}
            dismissible
          >
            Failure. Please try again.
          </Alert>
        )}
      </div>
    </div>
    
  );
}