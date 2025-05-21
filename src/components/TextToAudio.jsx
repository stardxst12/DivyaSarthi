import { useState, useEffect } from "react";
import "../styles/TextToAudio.scss"; // Import the CSS file

const TextToSpeech = ({ text }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [controlsVisible, setControlsVisible] = useState(false);

  useEffect(() => {
    setVoices(speechSynthesis.getVoices());
  }, []);

  const speak = () => {
    if (!isSpeaking) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voices[0] || speechSynthesis.getVoices()[0];
      speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      setControlsVisible(true);

      utterance.onend = () => {
        setIsSpeaking(false);
        setControlsVisible(false); // Hide controls when speech ends
      };
    }
  };

  const pause = () => {
    speechSynthesis.pause();
    setIsSpeaking(false);
  };

  const resume = () => {
    speechSynthesis.resume();
    setIsSpeaking(true);
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setControlsVisible(false); // Hide controls when stopped
  };

  return (
    <div className="tts-container">
      {/* Listen Button */}
      <button className="tts-button" onClick={speak} disabled={isSpeaking} title="Listen">🔊</button>

      {/* Show Play/Pause/Stop only after clicking "Listen" */}
      {controlsVisible && (
        <>
          <button className="tts-button" onClick={pause} title="Pause">⏸</button>
          <button className="tts-button" onClick={resume} title="Resume">▶</button>
          <button className="tts-button" onClick={stop} title="Stop">⏹</button>
        </>
      )}
    </div>
  );
};

export default TextToSpeech;

/*import { useState, useEffect } from "react";
import '../TextToAudio/TextToAudio.scss';

const TextToSpeech = ({ text }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const availableVoices = speechSynthesis.getVoices();
    setVoices(availableVoices);
  }, []);

  const speak = () => {
    if (!isSpeaking) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voices[0] || speechSynthesis.getVoices()[0]; // Default voice
      speechSynthesis.speak(utterance);
      setIsSpeaking(true);

      utterance.onend = () => setIsSpeaking(false);
    }
  };

  const pause = () => {
    speechSynthesis.pause();
    setIsSpeaking(false);
  };

  const resume = () => {
    speechSynthesis.resume();
    setIsSpeaking(true);
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div>
      <button onClick={speak} disabled={isSpeaking}>🔊 Listen</button>
      <button onClick={pause}>⏸ Pause</button>
      <button onClick={resume}>▶ Resume</button>
      <button onClick={stop}>⏹ Stop</button>
    </div>
  );
};

export default TextToSpeech;*/
