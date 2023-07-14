import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "../App.css";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import FormLabel from "react-bootstrap/esm/FormLabel";
import TranslatedLyrics from "./TranslatedLyrics";
import backArrow from "../assets/arrow-round-back.svg"
import sampleAlbumCover from "../assets/sample-cover.png"
import axiosInstance from "../axios";

function InputGroupSongSearch() {
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

  const [isFormVisible, setIsFormVisible] = useState(true);
  const [errorShow, setErrorShow] = useState(false);
  const [translatedLyrics, setTranslatedLyrics] = useState("");
  const [originalLyrics, setOriginalLyrics] = useState("");
  const [showFailureAlert, setShowFailureAlert] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (e.target[0].value === "" || e.target[1].value === "" || e.target[2].value === "")
      // TODO: Add warning
      console.log("asd");

    const selectedLanguage = languagesDict[e.target[2].value]; // Get the language code from the selected value
    axiosInstance.get('/get-song-info', {
      params: {
        artistName: e.target[0].value,
        songName: e.target[1].value,
        desiredLanguage: selectedLanguage, // Set the desiredLanguage as selectedLanguage
      },
    })
      .then(response => {

        if(response.data.translatedData == null) {
          setShowFailureAlert(true)

        }
        else{
        // Handle the response
          console.log(response.data);
          setTranslatedLyrics(response.data.translatedData);
          setOriginalLyrics(response.data.originalLyrics);
          setIsFormVisible(false); 
        }
      })
      .catch(error => {
        // Handle the error
        console.error(error);
      });
  };

  return (
    <div className="search">
      {isFormVisible ? (
        <Form onSubmit={handleSubmit}>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              Song Artist
            </InputGroup.Text>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              required
            />
          </InputGroup>
          <br />
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              Song Name
            </InputGroup.Text>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              required
            />
          </InputGroup>
          <br />
          <FormLabel>Translate to </FormLabel>
          <Form.Select defaultValue="" aria-label="Select Language" required>
            <option disabled value="">
              Select Language
            </option>
            {languages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </Form.Select>
          <br />
          {showFailureAlert && (
            <Alert
              variant="danger"
              onClose={() => setShowFailureAlert(false)}
              dismissible
            >
              The song is not in the database.
            </Alert>
          )}
          <div class="col text-center">
            <Button
              variant="primary"
              type="submit"
            >
              Search
            </Button>{" "}
          </div>

          <br />

          { /*show && (
            <Alert variant="danger" onClose={() => setShow(false)} dismissible>
              <Alert.Heading>Error!</Alert.Heading>
              <p>We could not find the song you were looking for.</p>
            </Alert>
          ) */ }
        </Form>
      ) : (
        <div>
          <img src={backArrow} alt="back" onClick={() => setIsFormVisible(true)}></img>
          <br/>
          <img className="album-cover" src={sampleAlbumCover}></img>
          <div class='lyrics_div'>
          <TranslatedLyrics lyrics={translatedLyrics}></TranslatedLyrics>
          <TranslatedLyrics lyrics={originalLyrics}></TranslatedLyrics>
          </div>

        </div>
      )}
    </div>
  );
}

export default InputGroupSongSearch;
