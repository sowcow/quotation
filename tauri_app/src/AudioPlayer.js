export class AudioPlayer {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.currentSource = null;
    this.audioBuffer = null;   // The decoded audio data loaded via play()
    this.startTime = 0;        // When the playback started (or resumed)
    this.pauseOffset = 0;      // How far into the audio we are (in seconds)

    // Properties for recording functionality:
    this.mediaRecorder = null; // The MediaRecorder instance
    this.recordedChunks = [];  // Chunks recorded from the microphone
    this.lastRecording = null; // The last recorded audio (decoded into an AudioBuffer)
    this.recordingStream = null; // The media stream from getUserMedia
  }

  /**
   * Loads and starts playing the audio from the given Uint8Array.
   * @param {Uint8Array} uint8Array - The audio data.
   * @param {number} [startTime=0] - The starting point in seconds.
   */
  async play(uint8Array, startTime = 0) {
    // Stop any current playback and reset the offset.
    this.stop();

    // Decode the audio data.
    let arrayBuffer = uint8Array.buffer.slice(
      uint8Array.byteOffset,
      uint8Array.byteOffset + uint8Array.byteLength
    );
    this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

    // Set the offset and record the start time.
    this.pauseOffset = startTime;
    this.startTime = this.audioContext.currentTime - startTime;

    // Create a new source node and start playback.
    this.currentSource = this.audioContext.createBufferSource();
    this.currentSource.buffer = this.audioBuffer;
    this.currentSource.connect(this.audioContext.destination);
    this.currentSource.start(0, startTime);
  }

  /**
   * Stops playback and resets the pause offset.
   */
  stop() {
    if (this.currentSource) {
      this.currentSource.stop();
      this.currentSource = null;
    }
    this.pauseOffset = 0;
  }

  /**
   * Toggles playback: pauses if currently playing, or resumes if paused.
   * (Requires that an audioBuffer has been loaded already via play().)
   */
  toggle() {
    // If no audio has been loaded, there is nothing to toggle.
    if (!this.audioBuffer) return;

    if (this.currentSource) {
      // Currently playing: pause it.
      // Calculate how many seconds have elapsed since playback started.
      this.pauseOffset = this.audioContext.currentTime - this.startTime;
      this.currentSource.stop();
      this.currentSource = null;
    } else {
      // Currently paused: resume playback from the pause offset.
      this.startTime = this.audioContext.currentTime - this.pauseOffset;
      this.currentSource = this.audioContext.createBufferSource();
      this.currentSource.buffer = this.audioBuffer;
      this.currentSource.connect(this.audioContext.destination);
      this.currentSource.start(0, this.pauseOffset);
    }
  }

  /**
   * Starts recording audio from the microphone.
   * Requests permission and begins capturing audio chunks.
   */
  async startRecording() {
    //try {
    //   const permissionStatus = await navigator.permissions.query({
    //  name: 'microphone',
    //});
    //  console.log(permissionStatus)

      // Request access to the microphone.
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.recordingStream = stream;
      this.recordedChunks = [];

      // Initialize MediaRecorder with the stream.
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      // Start recording.
      this.mediaRecorder.start();
    //  console.log("Recording started...");
    //} catch (err) {
    //  console.error("Error accessing the microphone:", err);
    //}
  }

  /**
   * Stops recording audio.
   * Once stopped, the recorded data is combined, decoded, and stored
   * in the `lastRecording` variable as an AudioBuffer.
   * @returns {Promise} Resolves when decoding is complete.
   */
  async stopRecording() {
    if (!this.mediaRecorder) {
      console.warn("No recording is in progress.");
      return;
    }

    // Return a promise that resolves after processing the recorded data.
    return new Promise((resolve, reject) => {
      // Set up the onstop event to process the recorded chunks.
      this.mediaRecorder.onstop = async () => {
        try {
          // Combine the recorded chunks into a single Blob.
          const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
          const arrayBuffer = await blob.arrayBuffer();

          // Decode the recorded audio data into an AudioBuffer.
          this.lastRecording = await this.audioContext.decodeAudioData(arrayBuffer);
          console.log("Recording stopped and decoded successfully.");

          // Clean up the media stream.
          if (this.recordingStream) {
            this.recordingStream.getTracks().forEach(track => track.stop());
            this.recordingStream = null;
          }

          resolve();
        } catch (error) {
          reject(error);
        }
      };

      // Stop the MediaRecorder.
      this.mediaRecorder.stop();
      this.mediaRecorder = null;
    });
  }

  /**
   * Plays back the last recorded audio (stored in `lastRecording`).
   */
  playRecording() {
    if (this.lastRecording) {
      const source = this.audioContext.createBufferSource();
      source.buffer = this.lastRecording;
      source.connect(this.audioContext.destination);
      source.start(0);
      console.log("Playing the last recording...");
    } else {
      console.warn("No recording available to play.");
    }
  }
}
