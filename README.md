Seeing Music is part of [Creatability](https://experiments.withgoogle.com/collection/creatability) which explores how creative tools can be made more accessible for everyone. The live site can be [found here](https://creatability.withgoogle.com/seeing-music/).

This is not a Google product.

# Overview

Seeing Music is a tool for visualizing music. You can turn on your mic to sing or play sounds. You can also drop in your own audio or video file. Some modes – like Hilbert Scope and Spectrogram – show the subtle textures of sound while others show the paths and shapes of different melodies.

Use **Basic Mode** to visualize monophonic music such as a human voice. Use **Piano Mode** to visualize polyphonic music such as piano recordings. You can also use Piano Mode to visualize a live performance using a MIDI keyboard.

The pitch detection is based on [this code](https://github.com/peterkhayes/pitchfinder). The Hilbert Scope is based on [this code](https://github.com/conundrumer/audioscope). The piano transcription is built with [Onsets and Frames](https://magenta.tensorflow.org/onsets-frames), a machine learning model made by the Magenta team at Google.

# Install and Run

To install and run make sure you have node.js and npm

```bash
npm install
npm run start
```

This will bundle all of the javascript files and start a local server on port 8080. Now to access the site you can visit http://localhost:8080/build

# Tools

* [Audioscope](https://github.com/conundrumer/audioscope)
* [PitchFinder](https://github.com/peterkhayes/pitchfinder)
* [Tone.js](https://github.com/Tonejs/Tone.js)
* [Magenta.js](https://github.com/tensorflow/magenta-js)

# Credits

This experiment was made by Jay Alan Zimmerman, Yotam Mann, Claire Kearney-Volpe, Luisa Pereira, Kyle Phillips, and Google Creative Lab. Music performed by Jacquelyn Briggs (voice), Sam Posner (saxophone), Matt Lewcowicz (guitar), Melissa Tong (violin), and Jonathan Singer (tabla). Special thanks to Hanna Ehrenberg, Julia Silvestri, and our friends at Henry Viscardi School at The Viscardi Center, Tech Kids Unlimited, and ADAPT Community Network.

# LICENSE

Copyright 2019 Google LLC

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License version 3 as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
