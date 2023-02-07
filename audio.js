/*---
 * Einfache Klasse um Zugriff auf Mikrophon über die WebAudio API zu ermöglichen 
 * Konstruktor generiert einen Button, um Zugriff auf Audio durch UserInteraktion zu ermöglichen
 * Bsp. https://github.com/mdn/webaudio-examples 
 * @author Hanna Züllig
 * 
 */

const audioCtx = new(window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.85;
analyser.fftSize = 128;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

const gainNode = audioCtx.createGain();
gainNode.connect(audioCtx.destination);


class Mic {
    /**
     * 
     * @param {*} val - Beschriftung des Buttons 
     */
    constructor(val) {
            this.mic;
            this.started = false;
            this.val = val;
            this.source;
            this.btn = document.createElement('button');
            this.btn.setAttribute("value", this.val);
            this.btn.innerHTML = this.val;
            this.btn.style.position = "absolute";
            this.btn.style.top = "0px";
            this.btn.style.left = "0px";
            this.OnEvent = OnEvent;
            var that = this;
            this.btn.addEventListener("click", this.OnEvent)
            document.body.append(this.btn);

            /**
             * wird über Button aufgerufen, handelt das Erstellen des Streams und Verknüpfen der Nodes
             */
            function OnEvent() {


                that.started = true;
               that.btn.style.opacity=0;




                if (navigator.mediaDevices.getUserMedia) {
                    console.log("getUserMedia supported.");
                    const constraints = { audio: true };
                    navigator.mediaDevices
                        .getUserMedia(constraints)
                        .then(function(stream) {
                            that.source = audioCtx.createMediaStreamSource(stream);
                            that.source.connect(gainNode);
                            gainNode.connect(analyser);


                            that.listenMic();

                        })
                        .catch(function(err) {
                            console.log("The following gUM error occured: " + err);
                        });
                } else {
                    console.log("getUserMedia not supported on your browser!");
                }

            }

        }
        /**
         * 
         * @returns Mittelwert der Werte im Buffer, von 0 bis 255
         */
    listenMic() {

        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            //console.log(dataArray[i])
            sum += dataArray[i];
        }
        //console.log(sum)
        return Math.floor(sum / bufferLength);
    }




}