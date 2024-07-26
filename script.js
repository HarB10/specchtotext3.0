document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("startBtn");
    const stopBtn = document.getElementById("stopBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const transcriptArea = document.getElementById("transcript");
    let recognition;
    let isRecording = false;
    let finalTranscript = '';

    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
        recognition = new SpeechRecognition();
    } else {
        alert("Sorry, your browser does not support speech recognition.");
        return;
    }

    recognition.continuous = true;
    recognition.interimResults = false;//we have change this true to false 
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        transcriptArea.value = finalTranscript + interimTranscript;
    };

    recognition.onstart = () => {
        isRecording = true;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        downloadBtn.disabled = true;
    };

    recognition.onend = () => {
        if (isRecording) {
            recognition.start();
        } else {
            stopBtn.disabled = true;
            startBtn.disabled = false;
            downloadBtn.disabled = finalTranscript.length === 0;
        }
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === 'no-speech' && isRecording) {
            recognition.start();
        }
    };

    startBtn.addEventListener("click", () => {
        if (!isRecording) {
            recognition.start();
        }
    });

    stopBtn.addEventListener("click", () => {
        if (isRecording) {
            isRecording = false;
            recognition.stop();
        }
    });

    downloadBtn.addEventListener("click", () => {
        const blob = new Blob([finalTranscript], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transcript.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});
