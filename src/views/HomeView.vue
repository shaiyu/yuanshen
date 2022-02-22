<template>
  <div class="home">
    <sync-loading :loading="loading" :type="'circle'"></sync-loading>
    <el-input v-model="originPageUrl" type="textarea" :rows="6" />

    <el-button @click="analyze">祈愿分析</el-button>
    <el-button @click="seeHistory">查看历史(本地)</el-button>

    <about-view
      :logs301="logs301"
      :logs302="logs302"
      :logs100="logs100"
      :logs200="logs200"
    ></about-view>
  </div>
</template>

<script>
// @ is an alias to /src
import { getClient } from "../plugins/axios-plugin";
import { gachaTypes } from "../utils/dictionary";
import { getLocalStorageJson } from "../utils/util";
import aboutView from "./AboutView";
import syncLoading from "@/components/SyncLoading.vue";

export default {
  name: "HomeView",
  components: { aboutView,syncLoading },
  data() {
    return {
      loading: false,
      loadingCounter: 0,
      originPageUrl: "",
      searchForm: {},
      logs100: [],
      logs200: [],
      logs301: [],
      logs302: [],
      history: {
        hasData: false,
        data: {
          logs100: [],
          logs200: [],
          logs301: [],
          logs302: [],
        },
      },
      endid: "0",
    };
  },

  mounted() {
    console.log("mounted", gachaTypes);
    this.getHistory();
    this.originPageUrl =
      "https://webstatic.mihoyo.com/hk4e/event/e20190909gacha/index.html?authkey_ver=1&sign_type=2&auth_appid=webview_gacha&init_type=301&gacha_id=65d8a446ed5b40a0932cf0a66ffa2c13392f72&timestamp=1644968920&lang=zh-cn&device_type=mobile&ext=%7b%22loc%22%3a%7b%22x%22%3a-13.494646072387696%2c%22y%22%3a272.2395324707031%2c%22z%22%3a259.7693786621094%7d%2c%22platform%22%3a%22Android%22%7d&game_version=CNRELAndroid2.5.0_R5923384_S5909260_D5939455&plat_type=android&region=cn_qd01&authkey=YQ%2bV9zEuiTWs3Fr2mUI9bJN1O1DFMGc45jvqb0URx1vcg6%2bGHS6gFYI3Ky%2bDtDJ0BUdylIyo4SLLZ0Pmkjah02QtJWbrbAWWjO%2bHKECTtiyuIhMeBE9XTw3YrWyn%2b%2fi8YyFc81u1AbCFDpy5kQVBMUUZFJTTpSi9eo85WcZJfysj2%2bfhjJpTypQ9A8xZtJL7SQ1NAiexICXOzbUIpSNzhgkUnFVNN7XvusTULHKvhJTwNlUfCSmnMHqQmz8EHRRbsrL3zw1IJr4LUuNGdYwdrO%2fxSOIswyQUiez07pw%2fgn6uxFv0qN5ggsM0XbWp5d1pLZIgcuNK9Q67tui51RN6qUJJONI7oSqr%2b78QgLh%2fYyvnJDdNAFSXN35IWC%2fO7ba3zqZA2cffFEELUzXqq6IU1NTp0XzeXI%2ff2owhcroF9vQTX%2fRDIDFPyejNFht5fy9kG60xj%2bdnorTR0XBY2NGUIvy0mEOezR8ho7le0NOKEK8XzhLoETr8D%2bA1nkh67%2fv7JQeP%2fDmhWx%2bzIYL1HjultGh3tmL%2ffNA7%2brRgi9zWzLH%2f%2f3wLu95PGzb%2fZPVLwp%2bhrFAQeozybNZi4m4KxSWwCMI9lJ6L340RQrQRVLpzw372Hxip%2bbuKQduZKFEHXwZu4Um2q8fxB5mNzzEiodcRcCUGNjpoJtmjRzHMnG9emvyqDofVT1gFchygVBNlkqTQm0Ud8%2bXgS7%2f87LlOGhVi6udZEIYAW6P0zZy%2bxgRl%2fG8nhQkKvSGn%2bnEXWaJEoppnEPjmkFnepcDOXadhS4hnD1RmECnNGibKnvaT71qRAT12tA0PlBSUd%2fmyX0IpHCrg%2bve%2fPxCQoDj1z4sn942YSDEJX6wVod56OHTmoQKCYl51XWf1ul5pUa%2fNPWPX7uMfPPhN4T5aXvKUHvjw21iJHRwnmj5PuxUMRP3DrlEXtbapDbbHIhcisQoIALmtpokkYomWwElmldrWROeg4TXY6YHDSupe3uxMqs1YQsPiMXq4qfoe%2bRABc11juj8GGfjNa8%2fOahN8L%2bEYes3V5ZXLS6gvelrJfgqcIJvJMSorYADOp533iWKnzjrpIH5O8yklk%2b8AtAunNUY73Igvqzdlztn5G0TCbP1vyUAcPp%2bWKebzE2p2ZORovhiMAbJSvbrF%2bwaFilSK%2fw9NhB%2fuPsowE%2b%2fTjN8%2b7P0OyzM7QsE3Q4m0tEOuHic7G3iRKQXaLXb%2fx%2b02NUauksMfi4h4cD6wjIRDXa8W%2bW6mxGpAX4i3ixmwgB%2bcjSzNtxqDZa7wOopF8srUKnu%2fnwS39ANsuU6Be49sjh2esNShbjpt5cRKScvV9MFgzmyxnjDVjbXKaihxUAYjAdhetmh8ZhFA8BJTdQ%3d%3d&game_biz=hk4e_cn#/log";
  },
  computed: {
    loadingText() {
      return "拼命加载中 " + this.loadingPercentage;
    },
    loadingPercentage() {
      let max = 100;
      while (this.loadingCounter > max) max += 10;
      let percentage = (this.loadingCounter / max) * 100;
      if (percentage > 99) {
        return percentage.toFixed(2) + "%";
      }
      return percentage.toFixed(0) + "%";
    },
  },
  methods: {
    getHistory() {
      let logs100 = getLocalStorageJson("yuanshen-logs-100");
      let logs200 = getLocalStorageJson("yuanshen-logs-200");
      let logs301 = getLocalStorageJson("yuanshen-logs-301");
      let logs302 = getLocalStorageJson("yuanshen-logs-302");

      this.history.hasData = true;
      this.history.data.logs100 = logs100;
      this.history.data.logs200 = logs200;
      this.history.data.logs301 = logs301;
      this.history.data.logs302 = logs302;
    },
    seeHistory() {
      this.logs100 = this.history.data.logs100;
      this.logs200 = this.history.data.logs200;
      this.logs301 = this.history.data.logs301;
      this.logs302 = this.history.data.logs302;
    },
    async analyze() {
      /*
https://webstatic.mihoyo.com/hk4e/event/e20190909gacha/index.html
?authkey_ver=1&sign_type=2&auth_appid=webview_gacha&init_type=301&gacha_id=65d8a446ed5b40a0932cf0a66ffa2c13392f72
&timestamp=1644968920&lang=zh-cn&device_type=mobile&ext=%7b%22loc%22%3a%7b%22x%22%3a-4428.14453125%2c%22y%22%3a217.31382751464845%2c%22z%22%3a-4023.00732421875%7d%2c%22platform%22%3a%22Android%22%7d
&game_version=CNRELAndroid2.5.0_R5923384_S5909260_D5939455&plat_type=android&region=cn_qd01
&authkey=YQ%2bV9zEuiTWs3Fr2mUI9bJN1O1DFMGc45jvqb0URx1vcg6%2bGHS6gFYI3Ky%2bDtDJ0BUdylIyo4SLLZ0Pmkjah02QtJWbrbAWWjO%2bHKECTtiyuIhMeBE9XTw3YrWyn%2b%2fi8YyFc81u1AbCFDpy5kQVBMUUZFJTTpSi9eo85WcZJfysj2%2bfhjJpTypQ9A8xZtJL7SQ1NAiexICXOzbUIpSNzhgkUnFVNN7XvusTULHKvhJTwNlUfCSmnMHqQmz8EHRRbsrL3zw1IJr4LUuNGdYwdrO%2fxSOIswyQUiez07pw%2fgn6uxFv0qN5ggsM0XbWp5d1pLZIgcuNK9Q67tui51RN6qWtTW7qZ5HeZO4bUL5JdXWuAv%2b5bmy01sSNjv25MWVVp8aigB1Sx4Sg%2bdGo4Q7j3ktEK9A%2fGLaePVZE4u3hlGRYAzGloRANeoPyhSADuJ9qtuS2nnRfdc%2b7C8K0u51TQkLeftnWJzvADUMPaVTyxxqx6GAjjAW3%2bq1Xo0IGEf7LMUNnxcMw3q2%2fXD1pLq47htzkzNjuHrcRdZkoAH5%2bQDL%2fvNfC2OcccqKNhTGgDiUlWEjCbScOi8Cdwm5NV5c3rarWuJlx3Vrh%2fwmAiv3Eu8uAh9TDh5HY8Vqujp7nqB42c5FnywOdp350pz4T%2bch7egZIVL93WYQt7FSapzt34RwWqDofVT1gFchygVBNlkqTQm0Ud8%2bXgS7%2f87LlOGhVi6udZEIYAW6P0zZy%2bxgRl%2fG8nhQkKvSGn%2bnEXWaJEoppnEPjmkFnepcDOXadhS4hnD1RmECnNGibKnvaT71qRAT12tA0PlBSUd%2fmyX0IpHCrg%2bve%2fPxCQoDj1z4sn942YSDEJX6wVod56OHTmoQKCYl51XWf1ul5pUa%2fNPWPX7uMfPPhN4T5aXvKUHvjw21iJHRwnmj5PuxUMRP3DrlEXtbapDbbHIhcisQoIALmtpokkYomWwElmldrWROeg4TXY6YHDSupe3uxMqs1YQsPiMXq4qfoe%2bRABc11juj8GGfjNaIciXqdmeoD0WMvPEE7on6pU%2fzCjcj%2bjRBRSsY26%2f6zLl5xKMi1scH8VfPxXQonvTLF%2blk0dNbmlRtvUjTI7Mlf2alhRp1RUAflRORjL1m8ySon8c56V9WcTDjVrPPtYQlwgsxH0dMKPycA5hlog%2bpCb34yHTu9vpktEizXuwhf6EvGK%2f0yoB22oEDczc1Si%2fuP1GZswMQVvNCarfdS1KKrbImGUpOVOOxi8f2E4TOXCeDFMEgEOEDEXUqW8maWhjQzWYylnErwvOswQbVwIgIUspirJTc%2fmYQY6eD%2bVV5c1qJWgtiJ0QmyU37UUzwyJAgyutyZZraVRhhFgpD2Kdg%3d%3d
&game_biz=hk4e_cn#/log
*/
      let para;
      try {
        let uri = new URL(this.originPageUrl);
        para = uri.search;
      } catch (error) {
        alert("请输入正确的url");
      }
      if (para) {
        this.loading = true;
        this.loadingCounter = 0;

        this.logs100 = await this.getAllLogs(para, 100);
        this.logs200 = await this.getAllLogs(para, 200);
        this.logs301 = await this.getAllLogs(para, 301);
        this.logs302 = await this.getAllLogs(para, 302);

        this.loading = false;
      } else {
        alert("请输入正确的url");
      }
    },
    async getAllLogs(para, type) {
      let logs = await this.getAllLogsLoop(para, type);
      localStorage.setItem("yuanshen-logs-" + type, JSON.stringify(logs));
      return logs;
    },
    async getAllLogsLoop(para, type) {
      let page = 1;
      let size = 6; //max=20 def=6

      let logs = [];
      this.endid = 0;

      while (true) {
        //if (page > 10) break;
        this.loadingCounter += 10;

        // list page size
        let random = 500 + Math.random() * 500;
        sleep(random);

        let data = await this.getLogs(para, type, page, size);
        if (!data) break;

        page++;
        logs.push.apply(logs, data.list);

        //最后一页
        if (data.list.length != size) {
          break;
        }
      }
      return logs;
    },
    async getLogs(para, type, page, size) {
      para += "&gacha_type=" + type;
      para += "&page=" + page;
      para += "&size=" + size;
      para += "&end_id=" + this.endid;

      var resp = await this.getGachaLog(para);
      //data  message  retcode
      if (resp.retcode == 0) {
        let data = resp.data; // list page size
        this.endid =
          data.list.length > 0 ? data.list[data.list.length - 1].id : "0";
        return data;
      } else {
        alert(resp.message);
      }
      return {};
    },

    async getGachaLog(para) {
      return await getClient("https://hk4e-api.mihoyo.com").get(
        "/event/gacha_info/api/getGachaLog" + para
      );
    },
  },
};
</script>
