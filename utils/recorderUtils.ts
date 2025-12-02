import { decodeBase64, decodeAudioData } from './audioUtils';

export const mergeAudioAndVisual = async (
  audioBase64: string,
  visualUri: string,
  isVideo: boolean
): Promise<Blob> => {
  // 1. Prepare Audio
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const audioBytes = decodeBase64(audioBase64);
  const audioBuffer = await decodeAudioData(audioBytes, ctx);
  
  const dest = ctx.createMediaStreamDestination();
  const source = ctx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(dest);

  let videoStream: MediaStream;
  let cleanup: () => void = () => {};

  // 2. Prepare Visual Stream
  if (isVideo) {
    // For Video, we attempt to capture the stream. 
    // Note: This requires the video source to support CORS (crossOrigin="anonymous")
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.src = visualUri;
    video.muted = true; // Required to play without user interaction context
    video.loop = true;  // Loop visual if audio is longer
    
    // Wait for metadata to ensure dimensions are known
    await new Promise((resolve) => {
        video.onloadedmetadata = resolve;
        video.onerror = resolve; // proceed anyway to handle error later
    });

    await video.play();

    // Standard vs Webkit prefix
    const captureStream = (video as any).captureStream || (video as any).mozCaptureStream;
    if (!captureStream) throw new Error("Browser does not support video capture");
    
    videoStream = captureStream.call(video);
    cleanup = () => {
        video.pause();
        video.src = "";
        video.remove();
    };
  } else {
    // For Image, we draw to a canvas
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = visualUri;
    await new Promise((resolve) => (img.onload = resolve));
    
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const canvasCtx = canvas.getContext('2d')!;
    
    // Draw background
    canvasCtx.fillStyle = '#000';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw image centered and contained
    const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width / 2) - (img.width / 2) * scale;
    const y = (canvas.height / 2) - (img.height / 2) * scale;
    
    // Animation loop to keep stream active
    let active = true;
    const draw = () => {
       if (!active) return;
       canvasCtx.drawImage(img, x, y, img.width * scale, img.height * scale);
       requestAnimationFrame(draw);
    };
    draw();

    videoStream = canvas.captureStream(30); // 30 FPS
    cleanup = () => { active = false; canvas.remove(); };
  }

  // 3. Combine Tracks
  const combinedStream = new MediaStream([
    ...videoStream.getVideoTracks(),
    ...dest.stream.getAudioTracks(),
  ]);

  // 4. Record
  const recorder = new MediaRecorder(combinedStream, {
    mimeType: 'video/webm; codecs=vp9'
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  return new Promise((resolve, reject) => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      cleanup();
      source.disconnect();
      ctx.close();
      resolve(blob);
    };

    recorder.onerror = (e) => {
        cleanup();
        reject(e);
    };

    // Start everything
    recorder.start();
    source.start(0);

    // Stop when audio finishes
    source.onended = () => {
      recorder.stop();
    };
  });
};