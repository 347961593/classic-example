
<template>
  <div>
    <button @click="SR">{{ btnTxt }}</button>
    <br />
    {{ resultTextTemp }}
    <br />
    {{ result }}
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import CryptoJS from "crypto-js";
import '/public/js/xf/index.umd.js'
// const RecorderManager = require("/public/static/js/xf/index.umd.js");
const APPID = "57ad5e97";
const API_SECRET = "NDJiZjkzZDgzM2U5NTI4MjA2M2IyN2Fm";
const API_KEY = "fc4effe6973e9ab72be197fe8ae60876";
const btnStatus = ref("UNDEFINED"); // "UNDEFINED" "CONNECTING" "OPEN" "CLOSING" "CLOSED"
let recorder = null;
let iatWS = null;
const resultText = ref("");
const resultTextTemp = ref("");
const result = ref("");
let countdownInterval = null;
const btnTxt = ref("开始录音");

// 录音按钮点击事件
  function SR() {
      if (btnStatus.value === "UNDEFINED" || btnStatus.value === "CLOSED") {
        connectWebSocket();
      } else if (btnStatus.value === "CONNECTING" || btnStatus.value === "OPEN") {
        // 结束录音
        recorder.stop();
      }
    }
    // 获取websocket地址
    function getWebSocketUrl() {
      // 请求地址根据语种不同变化
      let url = "wss://iat-api.xfyun.cn/v2/iat";
      let host = "iat-api.xfyun.cn";
      let apiKey = API_KEY;
      let apiSecret = API_SECRET;
      let date = new Date().toGMTString();
      let algorithm = "hmac-sha256";
      let headers = "host date request-line";
      let signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/iat HTTP/1.1`;
      let signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret);
      let signature = CryptoJS.enc.Base64.stringify(signatureSha);
      let authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
      let authorization = btoa(authorizationOrigin);
      url = `${url}?authorization=${authorization}&date=${date}&host=${host}`;
      return url;
    }
    // 连接服务器
    function connectWebSocket() {
      const websocketUrl = getWebSocketUrl();
      if ("WebSocket" in window) {
        iatWS = new WebSocket(websocketUrl);
      } else if ("MozWebSocket" in window) {
        iatWS = new MozWebSocket(websocketUrl);
      } else {
        alert("浏览器不支持WebSocket");
        return;
      }
      changeBtnStatus("CONNECTING");
      iatWS.onopen = (e) => {
        console.log(e);
        // 开始录音
        recorder.start({
          sampleRate: 16000,
          frameSize: 1280,
        });
        let params = {
          common: {
            app_id: APPID,
          },
          business: {
            language: "zh_cn",
            domain: "iat",
            accent: "mandarin",
            vad_eos: 5000,
            dwa: "wpgs",
            ptt: 0, // 标点符号
          },
          data: {
            status: 0,
            format: "audio/L16;rate=16000",
            encoding: "raw",
          },
        };
        iatWS.send(JSON.stringify(params));
      };
      iatWS.onmessage = (e) => {
        renderResult(e.data);
      };
      iatWS.onerror = (e) => {
        console.log(e);
        recorder.stop();
        changeBtnStatus("CLOSED");
      };
      iatWS.onclose = (e) => {
        recorder.stop();
        changeBtnStatus("CLOSED");
      };
    }
    function toBase64(buffer) {
      let binary = "";
      let bytes = new Uint8Array(buffer);
      let len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    }
    function changeBtnStatus(status) {
      btnStatus.value = status;
      if (status === "CONNECTING") {
        btnTxt.value = "建立连接中";
        resultText.value = "";
        resultTextTemp.value = "";
      } else if (status === "OPEN") {
        countdown();
      } else if (status === "CLOSING") {
        btnTxt.value = "关闭连接中";
      } else if (status === "CLOSED") {
        btnTxt.value = "开始录音";
      }
    }
    function countdown() {
      let seconds = 60;
      btnTxt.value = `录音中（${seconds}s）`;
      countdownInterval = setInterval(() => {
        seconds = seconds - 1;
        if (seconds <= 0) {
          clearInterval(countdownInterval);
          recorder.stop();
        } else {
          btnTxt.value = `录音中（${seconds}s）`;
        }
      }, 1000);
    }
    // 渲染结果
    function renderResult(resultData) {
      // 识别结束
      let jsonData = JSON.parse(resultData);
      if (jsonData.data && jsonData.data.result) {
        let data = jsonData.data.result;
        let str = "";
        let ws = data.ws;
        for (let i = 0; i < ws.length; i++) {
          str = str + ws[i].cw[0].w;
        }
        // 开启wpgs会有此字段(前提：在控制台开通动态修正功能)
        // 取值为 "apd"时表示该片结果是追加到前面的最终结果；取值为"rpl" 时表示替换前面的部分结果，替换范围为rg字段
        if (data.pgs) {
          if (data.pgs === "apd") {
            // 将resultTextTemp同步给resultText
            resultText.value = resultTextTemp.value;
          }
          // 将结果存储在resultTextTemp中
          resultTextTemp.value = resultText.value + str;
        } else {
          resultText.value = resultText.value + str;
        }
        result.value = resultTextTemp.value || resultText.value || "";
      }
      if (jsonData.code === 0 && jsonData.data.status === 2) {
        iatWS.close();
      }
      if (jsonData.code !== 0) {
        iatWS.close();
        console.error(jsonData);
      }
    }

onMounted(() => {
    recorder = new RecorderManager("public/js/xf"); // processor.worker.js和processor.worklet.js的根目录（注意: 这里的路径是相对于index.html的，而不是相对于本vue）
    recorder.onStart = () => {
      changeBtnStatus("OPEN");
    };
    recorder.onFrameRecorded = ({ isLastFrame, frameBuffer }) => {
      if (iatWS.readyState === iatWS.OPEN) {
        iatWS.send(
          JSON.stringify({
            data: {
              status: isLastFrame ? 2 : 1,
              // status: 1,
              format: "audio/L16;rate=16000",
              encoding: "raw",
              audio: toBase64(frameBuffer),
            },
          })
        );
        if (isLastFrame) {
          changeBtnStatus("CLOSING");
        }
      }
    };

    recorder.onStop = () => {
      clearInterval(countdownInterval);
    };
  },
)

</script>