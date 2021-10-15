<!--
 * @Descripttion: 
 * @Author: mt
 * @version: 
 * @Date: 2021-08-22 14:53:26
 * @LastEditors: mt
 * @LastEditTime: 2021-08-25 11:48:08
-->
<template>
  <div>
    <el-card class="box-card card-margin">
      <div slot="header" class="clearfix">
        <span>频响设置</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="save"
          >保存</el-button
        >
      </div>
      <div class="demo-input-suffix">
        <span class="title-span">通道值：</span>
        <el-input placeholder="" v-model="frf.Id" style="width: 200px">
        </el-input>
      </div>
      <div class="demo-input-suffix">
        <span class="title-span">段值：</span>
        <el-input placeholder="" v-model="frf.Segment" style="width: 200px">
        </el-input>
      </div>
      <div class="demo-input-suffix">
        <span class="title-span">点值：</span>
        <el-input placeholder="" v-model="frf.Point" style="width: 200px">
        </el-input>
      </div>
      <!-- <div class="demo-input-suffix">
        <span class="title-span">偏压设置：</span>
        <el-input placeholder="" v-model="frf.BiasVal" style="width: 200px">
        </el-input>
      </div> -->
      <div class="demo-input-suffix">
        <span class="title-span">校准值：</span>
        <el-input placeholder="" v-model="frf.CorrectVal" style="width: 200px">
        </el-input>
      </div>
      <div class="demo-input-suffix">
        <el-switch
          v-model="frf.Flag"
          active-text="按用户设置"
          inactive-text="不按照用户设置"
        >
        </el-switch>
      </div>
      <div class="bottom clearfix">
        电压(mV):{{ frf.v }} 电流(nA): {{ frf.a }}校准电流(nA): {{ frf._a }}
        <el-button
          style="float: right"
          type="text"
          class="button"
          @click="measure"
          >设置</el-button
        >
      </div>
      <el-alert
        title="通道值：0,1,2,3 
段值: 0,1,2,3,4,5,6,7，
点值: 0,1,
偏压设置: 0.0-100.0,
校准值: (nA)，
是否使用用户设置:0,1 0：否，1：是"
        type="info"
        :closable="false"
        show-icon
      />
    </el-card>
    <el-card class="box-card card-margin">
      <div slot="header" class="clearfix">
        <span>偏差校准设置</span>
      </div>
      <div class="demo-input-suffix">
        <span class="title-span">通道值：</span>
        <el-input placeholder="" v-model="cail.Id" style="width: 200px">
        </el-input>
      </div>
      <div class="demo-input-suffix">
        <span class="title-span">校准值：</span>
        <el-input placeholder="" v-model="cail.CaliVal" style="width: 200px">
        </el-input>
      </div>
      <div class="bottom clearfix">
        电压(mV):{{ cail.v }} 电流(nA): {{ cail.a }}
        <el-button
          style="float: right"
          type="text"
          class="button"
          @click="setCail"
          >设置</el-button
        >
      </div>
      <el-alert
        title="通道数:0,1,2,3,校准值:1.0"
        type="info"
        :closable="false"
        show-icon
      />
    </el-card>
    <!-- <el-card>

      <el-input
        type="textarea"
        autosize
        placeholder="请输入内容"
        v-model="axbx"
      >
      </el-input>
    </el-card> -->
    <el-button type="text" class="button" @click="getAx">获取axbx</el-button>
    <div v-for="(value, key) in objs" :key="key">
      <el-divider content-position="left">{{key}}</el-divider>
      <el-input
        type="textarea"
        autosize
        placeholder="请输入内容"
        :value="JSON.stringify(value)"
      >
      </el-input>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    send: {
      type: Function,
      default: null,
    },
    ab2str: {
      type: Function,
      default: null,
    },
    socketObj: {
      default: null,
    },
  },
  data() {
    return {
      objs: {
      },
      frf: {
        Id: 1,
        Segment: 1,
        Point: 1,
        CorrectVal: 1,
        Flag: true,
        v: "",
        a: "",
        _a: "",
      },
      cail: {
        Id: 1,
        CaliVal: 1,
        v: "",
        a: "",
      },
      axbx: "",
    };
  },
  methods: {
    save() {
      this.send("COMMon:TemDEVice:SET:PDCorrectValSave");
    },
    measure() {
      this.send(
        `COMMon:TemDEVice:SET:PDCorrectVal:{Id:${this.frf.Id},Segment:${
          this.frf.Segment
        },Point:${this.frf.Point},CorrectVal:${this.frf.CorrectVal},flag:${
          this.frf.Flag ? 1 : 0
        }}`
      );
      console.log();
    },
    setCail() {
      this.send(
        `COMMon:TemDEVice:SET:PDCalibration:{Id:${this.cail.Id},CaliVal:${this.cail.CaliVal}}`
      );
      console.log(
        `COMMon:TemDEVice:SET:PDCalibration:{Id:${this.cail.Id},CaliVal:${this.cail.CaliVal}}`
      );
    },
    getAx() {
      this.socketObj.onmessage = this.getAxMsg;
      this.send("COMMon:TemDEVice:GET:AxBx");
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
        if (
          res.indexOf("PDCorrectVal") > 0 ||
          res.indexOf("PDMCalibration") > 0
        ) {
          let str = res.slice(res.indexOf("{"), res.length - 2);
          let json = JSON.parse(str);
          if (res.indexOf("PDCorrectVal") > 0) {
            this.frf.v = json.Vol;
            this.frf.a = json.Cur;
            this.frf._a = json.CorrectI;
          } else {
            this.cail.v = json.Vol;
            this.cail.a = json.Cur;
          }
        }
      };
    },
    getAxMsg(msg) {
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
        if (res.indexOf("COMMon:TemDEVice:GET:AxBx") > 0) {
          let str = res.slice(res.indexOf("AxBx:") + 5, res.length);
          this.axbx = str;
        } else if (res.slice(res.length - 5, res.length) == "END\r\n") {
          this.socketObj.onmessage = this.getMessage;
          let _str = this.axbx.slice(this.axbx.indexOf("{"), this.axbx.length);
          let json = JSON.parse(_str);
          this.objs = json
          return;
        }
        this.axbx += res;
      };
    },
  },
};
</script>

<style>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
}
.title-span {
  display: inline-block;
  width: 100px;
}
</style>