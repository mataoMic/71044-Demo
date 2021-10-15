<!--
 * @Descripttion: 
 * @Author: mt
 * @version: 
 * @Date: 2021-08-09 14:58:24
 * @LastEditors: mt
 * @LastEditTime: 2021-08-27 16:20:06
-->
<template>
  <div>
    <el-row :gutter="20">
      <el-col class="card-item" :span="10">
        <el-card class="box-card card-margin">
          <el-descriptions title="AD5322" :column="1">
            <el-descriptions-item label="AD5322_DAC"
              ><el-input v-model="AD" placeholder="请输入内容"></el-input
            ></el-descriptions-item>
          </el-descriptions>
          <div class="bottom clearfix">
            <el-button
              data-id="ad"
              style="float: right"
              type="text"
              class="button"
              @click="sendCmd"
              >设置</el-button
            >
          </div>
          <el-alert
            title="AD5322_DAC= 0-4096"
            type="info"
            :closable="false"
            show-icon
          />
        </el-card>
        <el-card class="box-card card-margin">
          <el-descriptions title="HC595" :column="1">
            <el-descriptions-item label="index">
              <el-input v-model="HC.index" placeholder="请输入内容"></el-input>
            </el-descriptions-item>
            <el-descriptions-item label="chanel">
              <el-input
                v-model="HC.channel"
                placeholder="请输入内容"
              ></el-input>
            </el-descriptions-item>
            <el-descriptions-item label="data ">
              <el-input v-model="HC.data" placeholder="请输入内容"></el-input>
            </el-descriptions-item>
          </el-descriptions>
          <div class="bottom clearfix">
            <el-button
              data-id="hc"
              style="float: right"
              type="text"
              class="button"
              @click="sendCmd"
              >设置</el-button
            >
          </div>
          <el-alert
            title="
          Index = 0,1,2,3 	
          (0:hc595_12, 1:hc595_34, 2:hc595_56, 3:hc595_78)
          Channel = 0-15	(PD0,…,PD15)
          Data = 0,1		(0:off, 1:on)"
            type="info"
            :closable="false"
            show-icon
          />
        </el-card>
      </el-col>
      <el-col class="card-item" :span="10">
        <el-card class="box-card card-margin">
          <el-descriptions title="PD通道" :column="1">
            <el-descriptions-item label="num"
              ><el-input v-model="PD1.num" placeholder="请输入内容"></el-input>
            </el-descriptions-item>
            <el-descriptions-item label="sw1"
              ><el-input v-model="PD1.sw1" placeholder="请输入内容"></el-input
            ></el-descriptions-item>
            <el-descriptions-item label="sw2"
              ><el-input v-model="PD1.sw2" placeholder="请输入内容"></el-input
            ></el-descriptions-item>
            <el-descriptions-item label="amp"
              ><el-input v-model="PD1.amp" placeholder="请输入内容"></el-input
            ></el-descriptions-item>
            <el-descriptions-item label="bias"
              ><el-input v-model="PD1.bias" placeholder="请输入内容"></el-input
            ></el-descriptions-item>
          </el-descriptions>
          <div class="bottom clearfix">
            <el-button
              data-id="pd1"
              style="float: right"
              type="text"
              class="button"
              @click="sendCmd"
              >设置</el-button
            >
          </div>
          <el-alert
            title="Num=0-15
Sw1,sw2,amp,bias = 0,1		(0:off, 1:on)"
            type="info"
            :closable="false"
            show-icon
          />
        </el-card>
        <el-card class="box-card card-margin">
          <el-descriptions title="PD各通道采样值" :column="1">
            <el-descriptions-item label="采样值">{{
              PD2.val
            }}</el-descriptions-item>
            <el-descriptions-item label="num"
              ><el-input v-model="PD2.Id" placeholder="请输入内0-15"></el-input
            ></el-descriptions-item>
          </el-descriptions>
          <div class="bottom clearfix">
            <el-button
              data-id="pd2"
              style="float: right"
              type="text"
              class="button"
              @click="sendCmd"
              >设置</el-button
            >
          </div>
          <el-alert title="Num=0-15" type="info" :closable="false" show-icon />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "config",
  props: {
    send: {
      type: Function,
      default: null,
    },
    ab2str: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      AD: 123,
      HC: {
        index: 1,
        channel: 1,
        data: 1,
      },
      PD1: {
        num: 0,
        sw1: 0,
        sw2: 0,
        amp: 0,
        bias: 0,
      },
      PD2: { Id: 1, val: 0 },
    };
  },
  methods: {
    sendCmd(e) {
      switch (e.currentTarget.dataset.id) {
        case "ad":
          this.send("COMMon:TemDEVice:SET:AD5322_DAC=" + this.AD);
          break;
        case "hc":
          this.send(
            `COMMon:TemDEVice:SET:HC595:{index: ${this.HC.index},channel:${this.HC.channel},data: ${this.HC.data}}`
          );
          break;
        case "pd1":
          console.log(
            `COMMon:TemDEVice:SET:PDChannel:{num:${this.PD1.num},sw1:${this.PD1.sw1},sw2:${this.PD1.sw2},amp:${this.PD1.amp},bias:${this.PD1.bias}}`
          );
          this.send(
            `COMMon:TemDEVice:SET:PDChannel:{num:${this.PD1.num},sw1:${this.PD1.sw1},sw2:${this.PD1.sw2},amp:${this.PD1.amp},bias:${this.PD1.bias}}`
          );
          break;
        case "pd2":
          console.log(`COMMon:TemDEVice:GET:PDValve:{num:${this.PD2}}`);
          this.send(`COMMon:TemDEVice:GET:PDValve:{num:${this.PD2.Id}}`);
          break;
        default:
          break;
      }
      console.log(e.currentTarget.dataset.id);
    },
    getMessage(msg) {
      var fileReader = new FileReader();
      fileReader.readAsArrayBuffer(msg.data);
      fileReader.onloadend = (params) => {
        console.log(this.ab2str(params.target.result));
        this.$notify.info({
          title: "返回结果",
          position: "top-left",
          message: this.ab2str(params.target.result),
        });
        let res = this.ab2str(params.target.result);
        if (res.indexOf("PDValue") > 0) {
          let str = res.slice(res.indexOf("=") + 1, res.length - 2);
          this.PD2.val = str;
        }
      };
    },
  },
  mounted() {},
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
