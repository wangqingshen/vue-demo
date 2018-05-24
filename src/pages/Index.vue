<template>
  <div id="shift">
    <div class="shiftContainer">
      <div class="search">
        <label>统计时间</label>
        <el-date-picker v-model="begin" type="datetime" value-format='yyyy-MM-dd HH:mm:ss' placeholder="选择日期时间" @focus='dateSel'></el-date-picker>
        <el-date-picker v-model="end" type="datetime" value-format='yyyy-MM-dd HH:mm:ss' placeholder="选择日期时间" @focus='dateSel'></el-date-picker>
        <el-form ref="form" v-if="showState">
          <el-form-item label="门店名称">
            <el-select v-model="branchId">
              <el-option v-for="(item, index) in branchList" :label="item.branchname" :value="item.branchid" :key=index></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-button type="warning" @click='search'>查询</el-button>
        <i>{{error}}</i>
      </div>
      <div class="postChange">
          <div class="duration">
            <p class="medium">应收金额:<span>￥{{money(dutyIfo.alldueamount)}}</span></p> 
            <p class="medium">折扣优惠:<span>￥{{money(dutyIfo.allcouponamount)}}</span></p>
            <p class="medium">消费人次:<span>{{dutyIfo.allcustnum != undefined?dutyIfo.allcustnum:'--'}}</span></p>
            <p class="medium">实收金额:<span>￥{{money(dutyIfo.allssamount)}}</span></p>
            <p class="medium">减免金额:<span>￥{{money(dutyIfo.allfeeamount)}}</span></p>        
            <p class="medium">人均消费:<span>￥{{money(dutyIfo.allaverage)}}</span></p>
          </div>
          <div class="post">
              <h4>收银明细</h4>
              <div>
                <ul class="postIfo">
                  <li>收款方式</li>
                  <li>消费单数</li>
                  <li>消费收款</li>
                  <li>会员充值单数</li>
                  <li>会员充值金额</li>
                  <li>退款单数</li>
                  <li>退款金额</li>
                  <li>作废单数</li>
                  <li>作废金额</li>
                </ul>
                <ul class="postDetail">
                  <li v-if='gatheringDetails.length' v-for="(gatheringDetail,index) in gatheringDetails" :class="{double:index % 2 == 1 }">
                    <ul :class="{double:index % 2 == 1 }">
                      <li>{{gatheringDetail.payname}}</li>
                      <li>{{gatheringDetail.consumecount}}</li>
                      <li>￥{{money(gatheringDetail.consumemoney)}}</li>
                      <li>{{gatheringDetail.vippaycount}}</li>
                      <li>{{gatheringDetail.vippaymoney}}</li>
                      <li>{{gatheringDetail.returncount}}</li>
                      <li>￥{{money(Math.abs(gatheringDetail.returnmoney))}}</li>
                      <li>{{gatheringDetail.cancelcount}}</li>
                      <li>￥{{money(gatheringDetail.cancelmoney)}}</li>
                    </ul>
                  </li>
                  <li v-if='!gatheringDetails.length' style='font-size: 0.14rem;color:black;margin-top: 0.1rem;'>暂无收银记录</li>
                </ul>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  components: {},
  data () {
    return {
      dutyIfo:{},
      gatheringDetails:[],
      begin:'',
      end:'',  
      error:'',
      personOrAllBusiness: [],
      branchList: [],
      branchId: '',
      showState: true,
      apiurl: 'http://localhost:8081/chain-newspicyway'
    }
  },
  mounted() {
    this.duration()
    this.getBranchList()
  }, 
  methods: {
    duration(){// 获取当前时间，根据当前时间默认营业统计查询时段
      let hour = new Date().getHours(),
        year=new Date().getFullYear(),
      month=('0'+ (+new Date().getMonth()+1)).slice(-2),
      date=new Date().getDate(),
      _hour=new Date().getHours(),
      minute=new Date().getMinutes(),
      second=new Date().getSeconds()      
      if(hour<6){ 
        this.begin = year + "-" + month + "-" + ('0'+(date-1).slice(-2)) + " " + "06:00:00"
        this.end = year + "-" + month + "-" + ('0'+(date)).slice(-2) + " " + "06:00:00"       
      }else if(hour>=6){
        this.begin = year + "-" + month + "-" + ('0'+date).slice(-2) + " " + "06:00:00"
        this.end = year + "-" + month + "-" + ('0'+(date+1)).slice(-2) + " " + "06:00:00"
      }
    },
    money(num){
      if(num == '' || num == undefined || num == 'undefined'){
        num = 0
      } 
      num = Number(num).toFixed(2)
      return num
    },
    format(timeStamp = +new Date()){
      let time = new Date(timeStamp),
         y = time.getFullYear(),
         m = time.getMonth()+1,
         d = time.getDate(),
         h = time.getHours(),
         mm = time.getMinutes(),
         s = time.getSeconds();
      function add0(m){return m<10?'0'+m:m }
      return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
    },
    getBranchList () {
      this.$ajax.post(this.apiurl+'/itemDetail/getBranchList', {}).then(res=>{
        if(res.data != '') {
          if(res.data.current) {
            this.branchId = res.data.current;
            this.showState = false;
            this.search();
          }else {
            this.branchList = res.data.branchList;
            this.showState = true;
          }
        }
      })
    },
    search(){
      let that = this;
      if(this.begin==''||this.end==''){
        this.error='请选择查询时段'
        return          
      }
      if(Date.parse(new Date(this.begin)) > Date.parse(new Date(this.end))){
        this.error='结束时段不能小于开始时段' 
        return 
      }   
      this.$ajax.post(this.apiurl+'/duty/allBusiness',
          {
            "userid":"",
            "starttime":this.begin,
            "endtime":this.end,
            "branchid":this.branchId 
          }
        ).then(res=>{
          if(res.data!=''){
            this.dutyIfo=res.data.personOrAllBusiness[0];
            this.gatheringDetails=res.data.business;
          }
        })
      },
      dateSel(){
        this.error=''
      },
  }
}
</script>

<style>
  html, body {height: 100%;margin: 0;}
  ul,li {
    padding: 0;
    margin: 0;
  }
  form.el-form, .el-form-item__content{
    display: inline-block;
  }
  .el-form-item {
    margin-bottom: 0;
  }
  #shift{
    width: 100%;
    height:100%;
    background: #f4f4f4;
    overflow: hidden;
    box-sizing: border-box;
    padding: 0.2rem;
  }
  #shift .search{
    margin-bottom: 0.2rem;
    background: white;
    padding: 0.2rem 0;
  }
  #shift .search label{
    font-size: 0.14rem;
    margin-left: 0.2rem;
  }
  #shift .search .el-date-picker{
    width: 10%;
  }
  #shift .search .el-button{
    font-size: 0.14rem;
    width: 0.8rem;
    background: #ff7e4b;
    margin-left: 0.15rem;
  }
  #shift .search .el-button span{
    color: white;
  }
  #shift .search .el-date-editor.el-input {
    width: 2rem;
    margin: 0 .1rem;
  }
  #shift .shiftContainer {
    width: 100%;
    height: 100%;
  }
  #shift .postChange{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0 0.2rem;
    background: white;
    overflow: auto;
  }
  #shift .postChange.postC {
    height: calc(100% - 1rem);
    padding-bottom: .2rem;
  }
  #shift .duration{
    width: 100%;
    max-width: inherit;
    height: auto;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    min-height: inherit;
    margin-bottom: .3rem;
  }
  #shift .duration div{
    width: 100%;
    height: 100%; 
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    overflow: auto;
  }
  #shift .duration .medium{
    box-sizing: border-box;
    padding: 0.1rem 0; 
    font-size: 0.14rem;
    color: #999999;
    height: 0.5rem;
    width: 26%;
    line-height: 0.25rem;
    margin-top: 0.1rem;
    padding-top: 0.2rem;
    line-height: 0.25rem;
    margin-top: 0.1rem;
    padding-top: 0.2rem;
  }
  #shift .duration .medium span{
    color:#ff916a;
    font-weight: 600;
    padding-left: 0.05rem;
  }
  #shift .post{
    width: 100%;
    /*height: 47%;*/
    margin: 0 auto;
    background: white;
    box-sizing: border-box;
    /*padding: 0 0.2rem;  */
  }
  #shift .postChange.postC .post {
    height: auto;
  }
  #shift .box .post {
    max-width: 8rem;
    width: 95% !important;
    /*max-height: calc(100% - 2.6rem);
    height: calc(62% - .4rem);*/
    margin: auto;
  }
  #shift .post h4{
    width: 100%;
    height: 0.3rem;
    line-height: 0.3rem;
    margin: 0;
    font-size: 0.16rem;
    color: #333333;
    font-weight: 600;
  }
  #shift .post > div{
    width: 100%;
    height: 88%; 
    border:1px solid #f4f4f4;
  }
  #shift .post div .postIfo{
    width: 100%;
    /*height:0.3rem;*/
    background: #f4f4f4;
    display: flex;
    padding: 0;
    list-style: none;
  }
  #shift .post div .postIfo li{
    flex:1;
    /*height: 0.4rem;*/
    box-sizing: border-box;
    padding: 0.05rem 0;
    text-align: center;
    font-size: 0.12rem;
    color: #999999;
  }
  #shift .post div .postDetail{
    width: 100%;
    height:85%;
    padding: 0;
    list-style: none;
    padding-bottom: .1rem;
    box-sizing: border-box;
    /*overflow: auto;*/
  }
  #shift .postChange.postC .post div .postDetail {
    height: auto;
  }
  #shift .post div .postDetail ul{
    width: 100%;
    height:0.3rem;
    display: flex;
    padding: 0;
  }
  #shift .post div .postDetail .double{
    background: #fafafa;
  }
  #shift .post div .postDetail li{
    flex:1;
    height: 0.3rem;
    line-height: 0.3rem;
    list-style: none;
    text-align: center;
    font-size: 0.12rem;
    color: #999999;
  }
  #shift .postChange .quit{
    width: 100%;
    height:0.4rem;
    margin: .4rem 0;
    /*margin-left: 0.2rem;*/
  }
  i{
    color:red;
    font-style: normal;
  }
</style>

