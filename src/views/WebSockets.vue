<template>
  <div>
    <input v-model="message" @keyup.enter="sendMessage()" />
    <button @click="sendMessage()">Send</button>
    <ul>
      <li v-for="msg in messages">{{ msg }}</li>
    </ul>
  </div>
</template>
<script setup>
import { ref, reactive, onUnmounted } from "vue";
const message = ref("");
const messages = ref([]);
const socket = new WebSocket("ws://localhost:3005");
const sendMessage = () => {
  socket.send(message.value);
  message.value = "";
};
socket.addEventListener("message", (event) => handleMessage(event.data));
const handleMessage = (data) => {
  messages.value.push(data);
};
// 监听WebSocket打开事件
socket.addEventListener("open", () => {
  console.log("WebSocket已连接");
  messages.value.push('连接成功');
});
// 监听WebSocket关闭事件
socket.addEventListener("close", () => {
  console.log("WebSocket连接已关闭");
  messages.value.push('连接关闭');
});

// 监听错误事件
socket.addEventListener("error", (error) => {
  console.error("WebSocket发生错误:", error);
  messages.value.push("WebSocket发生错误:", error);
});
onUnmounted(() => {
  socket.close();
});
</script>
<style scoped>
</style>