import React, { useRef, useEffect, useState, useCallback } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import { FaceMesh } from "@mediapipe/face_mesh";

export default function WebcamDetection() {
  const webcamRef = useRef(null);
  const faceMesh = useRef(null);

  const sleepFrames = useRef(0);
  const isAlarmPlaying = useRef(false);
  const alarm = useRef(null);

  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState("Idle");
  const [modelLoaded, setModelLoaded] = useState(false);

  const audioEnabled = useRef(false);
  const token = localStorage.getItem("token");

  // 🔊 INIT ALARM
  useEffect(() => {
    alarm.current = new Audio("/alarm.mp3");
    alarm.current.loop = true;
    alarm.current.preload = "auto";
  }, []);

  // ✅ SEND DATA
  const sendStatus = async (currentStatus) => {
    try {
      const API_URL =
        process.env.REACT_APP_API_URL || "http://localhost:5000";

      await fetch(`${API_URL}/api/detection/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: currentStatus,
          duration: 1,
        }),
      });
    } catch (err) {
      console.error("Error saving:", err);
    }
  };

  // ✅ DETECTION LOGIC (FIXED with useCallback)
  const onResults = useCallback((results) => {
    if (!results.multiFaceLandmarks?.length) return;

    const landmarks = results.multiFaceLandmarks[0];

    const eyeOpen = Math.abs(landmarks[159].y - landmarks[145].y);
    const mouthOpen = Math.abs(landmarks[13].y - landmarks[14].y);

    let newStatus = "Active";

    if (eyeOpen < 0.01) {
      sleepFrames.current++;

      if (sleepFrames.current > 5) {
        newStatus = "Sleeping";

        if (!isAlarmPlaying.current && audioEnabled.current) {
          alarm.current.play().catch((err) => {
            console.log("Audio blocked:", err);
          });
          isAlarmPlaying.current = true;
        }
      }
    } else {
      sleepFrames.current = 0;

      if (isAlarmPlaying.current) {
        alarm.current.pause();
        alarm.current.currentTime = 0;
        isAlarmPlaying.current = false;
      }

      if (mouthOpen > 0.05) {
        newStatus = "Drowsy";
      }
    }

    setStatus(newStatus);
    sendStatus(newStatus);
  }, []);

  // ✅ LOAD MODEL
  useEffect(() => {
    const loadModel = async () => {
      await tf.ready();

      faceMesh.current = new FaceMesh({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`,
      });

      faceMesh.current.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      faceMesh.current.onResults(onResults);

      setModelLoaded(true);
    };

    loadModel();
  }, [onResults]);

  // ✅ DETECTION LOOP
  useEffect(() => {
    if (!isRunning || !modelLoaded) return;

    const interval = setInterval(async () => {
      const video = webcamRef.current?.video;

      if (video && video.readyState === 4 && faceMesh.current) {
        await faceMesh.current.send({ image: video });
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isRunning, modelLoaded]);

  // ✅ START
  const startDetection = async () => {
    try {
      // unlock audio
      await alarm.current.play();
      alarm.current.pause();
      alarm.current.currentTime = 0;

      audioEnabled.current = true;
      setIsRunning(true);
    } catch (err) {
      console.log("Audio unlock failed:", err);
    }
  };

  // ✅ STOP
  const stopDetection = () => {
    setIsRunning(false);
    audioEnabled.current = false;

    alarm.current.pause();
    alarm.current.currentTime = 0;
    isAlarmPlaying.current = false;

    if (webcamRef.current?.video?.srcObject) {
      webcamRef.current.video.srcObject
        .getTracks()
        .forEach((track) => track.stop());
    }

    sleepFrames.current = 0;
    setStatus("Stopped");
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="w-96 rounded-lg"
      />

      <h2 className="text-xl font-bold">
        Status:
        <span
          className={
            status === "Sleeping"
              ? "text-red-500 ml-2"
              : status === "Drowsy"
              ? "text-yellow-500 ml-2"
              : "text-green-500 ml-2"
          }
        >
          {status}
        </span>
      </h2>

      {!isRunning ? (
        <button
          onClick={startDetection}
          className="bg-green-600 px-6 py-3 text-white rounded-lg"
        >
          Start Detection
        </button>
      ) : (
        <button
          onClick={stopDetection}
          className="bg-red-600 px-6 py-3 text-white rounded-lg"
        >
          Stop Detection
        </button>
      )}
    </div>
  );
}