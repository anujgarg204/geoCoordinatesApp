
import React, { useState, useEffect } from 'react';

import wavFile from '/Users/anuj/Coding/Newton/geocoordinatesapp/src/file_example_WAV_1MG.wav';

export default function Notification() {

  useEffect(() => {
    const audio = new Audio(wavFile)
     audio.play()
  }, []);

  return <div/ >
};