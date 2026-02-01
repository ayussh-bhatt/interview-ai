import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";

const VideoRecorder = forwardRef(({ onStop }, ref) => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const [recording, setRecording] = useState(false);

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 360 },
          audio: true,
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(chunksRef.current, {
            type: "video/webm",
          });
          chunksRef.current = [];
          onStop(blob);
        };
      } catch (err) {
        console.error("Camera access error:", err);
        alert("Camera or microphone access denied");
      }
    };

    setupCamera();

    // 🔥 CLEANUP ON UNMOUNT
    return () => {
      stopAllTracks();
    };
  }, [onStop]);

  const stopAllTracks = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  // 🔥 Expose stop method to parent
  useImperativeHandle(ref, () => ({
    stopCamera: stopAllTracks,
  }));

  const startRecording = () => {
    chunksRef.current = [];
    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div className="video-wrapper">
      <div className="video-frame">
        <video ref={videoRef} autoPlay muted />
      </div>

      <div className="video-actions">
        {!recording ? (
          <button className="video-btn start" onClick={startRecording}>
            Start Recording
          </button>
        ) : (
          <button className="video-btn stop" onClick={stopRecording}>
            Stop Recording
          </button>
        )}
      </div>
    </div>
  );
});

export default VideoRecorder;
