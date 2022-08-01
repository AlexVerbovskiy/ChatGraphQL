const getMedia = async (constraints) => {
    let stream = null;
    try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err) {
        console.log(err.name + ": " + err.message);
    }
    return stream;
}

let voice = [];
let mediaRecorder = null;

const mediaFunctional = async (mediaType, afterRecording) => {
    let resBlob = null;
    const constraints = mediaType === "video" ? {
        audio: true,
        video: true
    } : {
        audio: true
    };
    const stream = await getMedia(constraints);
    if (stream === null)
        return
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();

    mediaRecorder.addEventListener("dataavailable", async event => {
        voice = [];
        voice.push(event.data);
        console.log(event.data)
    });
    mediaRecorder.addEventListener("stop", () => {
        stream.getTracks().forEach((track) => track.stop());

        if (mediaType !== "video") {
            const voiceBlob = new Blob(voice, {
                type: 'audio/mp3'
            });
            resBlob = voiceBlob;
        } else {
            const videoBlob = new Blob(voice, {
                type: 'video/mp4'
            });
            resBlob = videoBlob;
        }
        afterRecording(resBlob);
    });

    const stopper = ()=>{
        mediaRecorder.stop();
        mediaRecorder = null;
    }

    return stopper;
}

export default mediaFunctional