<!--
 * @Descripttion: 
 * @Author: mt
 * @version: 
 * @Date: 2021-08-09 14:58:24
 * @LastEditors: mt
 * @LastEditTime: 2021-08-27 16:38:23
-->
<template>
  <div>
    <el-button @click="sendCmd">开始测试</el-button>
    <el-row>
      <el-col class="card-item" v-for="(item,i) in list" :span="10" :key="i">
        <el-card v-loading="item.loading" class="box-card card-margin">
          <el-descriptions :title="'通道' + (i+1)" :column="1">
            <el-descriptions-item label="电流值">{{
              item.get
            }}</el-descriptions-item>
            <el-descriptions-item label="偏压值"
              ><el-input
                v-model="item.input"
                placeholder="请输入内容"
              ></el-input
            ></el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
    <!-- <div class="progress" style="display: flex">
      <el-tag style="margin-right: 10px">进度</el-tag>
      <el-progress style="width: 200px" :percentage="50"></el-progress>
    </div> -->
  </div>
</template>

<script>
export default {
  name: "channel",
  props: {
    send: {
      type: Function,
      default: null,
    },
    str2ab: {
      type: Function,
      default: null,
    },
    ab2str: {
      type: Function,
      default: null,
    },
    handleClick: {
      type: Function,
      default: null,
    },
    socketObj: {
      default: null,
    },
  },
  data() {
    return {
      list: [
        { get: null, input: 0, loading: false },
        { get: null, input: 0, loading: false },
        { get: null, input: 0, loading: false },
        { get: null, input: 0, loading: false },
      ],
      resList: [
        {
          Pd: 0,
          flag: 1,
          Val: 1.2,
        },
        {
          Pd: 1,
          flag: 0,
          Val: 3,
        },
        {
          Pd: 2,
          flag: 1,
          Val: 1.3,
        },
        {
          Pd: 3,
          flag: 1,
          Val: 1.4,
        },
      ],
      testObj: {
        num: 0,
      },
      testDisable: false,
    };
  },
  methods: {
    sendTest() {
      this.testDisable = true;
      this.list[this.testObj.num].loading = true;
      setTimeout(() => {
        this.list[this.testObj.num].get = Math.random() * 10;
        this.list[this.testObj.num].loading = false;
        this.testDisable = false;
        if (this.testObj.num === 3) {
          this.testObj.num = 0;
        } else {
          this.testObj.num++;
        }
      }, 500);
    },
    sendCmd() {
      if (
        this.list[0].input ||
        this.list[1].input ||
        this.list[2].input ||
        this.list[3].input
      ) {
        console.log(`COMMon:TemDEVice:SET:PDMeasure:{Pd0Bias:${this.list[0].input},Pd1Bias:${this.list[1].input},Pd2Bias:${this.list[2].input},Pd3Bias:${this.list[3].input}}`)
        this.send(`COMMon:TemDEVice:SET:PDMeasure:{Pd0Bias:${this.list[0].input},Pd1Bias:${this.list[1].input},Pd2Bias:${this.list[2].input},Pd3Bias:${this.list[3].input}}`);
        this.list[0].loading = true;
      } else {
        this.$notify({
          title: "警告",
          message: "输入数值",
          position: "top-left",
          type: "warning",
        });
      }
    },
    getMessage(msg) {
      console.log(msg);
      var fileReader = new FileReader();
      fileReader.readAsArrayBuffer(msg.data);
      fileReader.onloadend = (params) => {
        console.log(this.ab2str(params.target.result));
        let res = this.ab2str(params.target.result);
        if (res.indexOf("PDMeasure") > 0) {
          let str = res.slice(res.indexOf("{"), res.length);
          console.log(str)
          let json = JSON.parse(str);
          console.log(json);
          this.list[json.Pd].get = json.Val
          this.list[json.Pd].loading = false
          if (json.Pd < 4) {
            this.list[json.Pd+1].loading = true
          }
        }
        this.$notify.info({
          title: "返回结果",
          message: this.ab2str(params.target.result),
        });
      };
    },
  },
  mounted() {
    console.log("cc");
    this.socketObj.onmessage = this.getMessage;
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-item {
  margin-top: 20px;
}
.progress {
  display: flex;
  align-items: center;
}
</style>
