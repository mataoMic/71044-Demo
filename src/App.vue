<!--
 * @Descripttion: 
 * @Author: mt
 * @version: 
 * @Date: 2021-08-09 14:58:24
 * @LastEditors: mt
 * @LastEditTime: 2021-08-28 12:40:49
-->
<template>
  <div id="app">
    <div v-if="!connectState">
      <!-- 连接ip：<el-input
        style="width: 200px; margin-right: 20px"
        v-model="ip"
        placeholder="请输入ip"
      ></el-input> -->
      <el-button type="text" @click="init">connect</el-button>
    </div>
    <div v-if="connectState">
      {{ip}}<i style="color:#67C23A" class="el-icon-check">已连接</i>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="频道测试" name="channel"
        ><channel
          ref="channel"
          :send="send"
          :ab2str="ab2str"
          :handleClick="handleClick"
          :socketObj="socket"
      /></el-tab-pane>
      <el-tab-pane label="参数配置" name="config"
        ><config
          ref="config"
          :send="send"
          :ab2str="ab2str"
          :handleClick="handleClick"
      /></el-tab-pane>
      <el-tab-pane label="频响设置" name="frf"
        ><frf ref="frf" :send="send" :ab2str="ab2str" :socketObj="socket"
      /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import channel from "./components/channel.vue";
import config from "./components/config.vue";
import frf from "./components/frf.vue";
export default {
  name: "app",
  data() {
    return {
      activeName: "channel",
      agentPath: "192.168.77.111:8888/Agent",
      ip: "192.168.77.242",
      socket: {},
      connectState: false,
    };
  },
  methods: {
    handleClick(tab) {
      console.log(tab.name);
      switch (tab.name) {
        case "channel":
          console.log(this.$refs.channel.getMessage);
          this.socket.onmessage = this.$refs.channel.getMessage;
          break;
        case "config":
          this.socket.onmessage = this.$refs.config.getMessage;
          break;
        case "frf":
          this.socket.onmessage = this.$refs.frf.getMessage;
          break;
        default:
          break;
      }
    },
    init: function () {
      if (this.ip == "") {
        this.$notify({
          title: "警告",
          message: "输入连接ip",
          position: "top-left",
          type: "warning",
        });
        return;
      }
      if (typeof WebSocket === "undefined") {
        alert("您的浏览器不支持socket");
      } else {
        // 实例化socket
        this.socket = new WebSocket(
          `ws://${this.agentPath}?Target=${this.ip}:9000&encoding=binary`
        );
        // 监听socket连接
        this.socket.onopen = this.open;
        // 监听socket错误信息
        this.socket.onerror = this.error;
        // 监听socket消息
        this.socket.onmessage = this.$refs.channel.getMessage;
      }
    },
    open: function () {
      this.connectState = true;
      this.send("#18,71044_44");
      console.log("socket连接成功");
    },
    error: function () {
      console.log("连接错误");
    },
    getMessage: function (msg) {
      var fileReader = new FileReader();
      fileReader.readAsArrayBuffer(msg.data);
      fileReader.onloadend = (params) => {
        console.log(this.ab2str(params.target.result));
      };
      console.log(msg);
    },
    send: function (params) {
      this.socket.send(this.str2ab(params + "/r/n"));
    },
    close: function () {
      this.connectState = false;
      console.log("socket已经关闭");
    },
    str2ab(str) {
      str = str + "\r\n";
      var buf = new ArrayBuffer(str.length); // 每个字符占用2个字节
      var bufView = new Uint8Array(buf);
      for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
      }
      return buf;
    },
    ab2str(buf) {
      let unit8Arr = new Uint8Array(buf);
      let encodedString = String.fromCharCode.apply(null, unit8Arr),
        decodedString = decodeURIComponent(escape(encodedString)); //没有这一步中文会乱码
      return decodedString;
    },
  },
  mounted() {},
  components: {
    channel,
    config,
    frf,
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
 .card-margin {
  margin:20px;
  width:40vw;
}
</style>
