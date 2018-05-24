<template>
  <div class="login-box">
    <el-row>
      <el-col :span="8">
          <el-input id="name" v-model="name" placeholder="请输入帐号">
              <template slot="prepend">帐号</template>
          </el-input> 
      </el-col>
     </el-row>
     <el-row>
        <el-col :span="8">
            <el-input id="password" v-model="password" type="password" placeholder="请输入密码">
                <template slot="prepend">密码</template>
            </el-input>
        </el-col>
     </el-row>
     <el-row>
        <el-col :span="8">
            <el-button id="login" v-on:click="check" style="width:100%" type="primary"  @click="openFullScreen"
            v-loading.fullscreen.lock="fullscreenLoading">登录</el-button>
        </el-col>
     </el-row>
  </div>
</template>

<script>
export default {
  name: 'Login',
  components: {},

  data () {
    return {
      name : '',
      password : '',
      fullscreenLoading: false
    }
  },
  mounted() {
    
  }, 
  methods: {
    check : function(event){
          this.fullscreenLoading = true;
          setTimeout(() => {
            this.fullscreenLoading = false;
          }, 2000);
          //获取值
          var name = this.name;
          var password = this.password;
          if(name == '' || password == ''){
              // this.$message({
              //     message : '账号或密码为空！',
              //     type : 'error'
              // })
              return;
          }

          $.ajax({
              url : 'login',
              type : 'post',
              data : {
                  name : name,
                  password : password
              },
              success : function(data) {
                  var result = data.result;
                  if(result == 'true' || result == true){
                      alert("登录成功");
                  }else {
                      alert("登录失败");
                  }
              },
              error : function(data) {
                  alert(data);
              },
              dataType : 'json',
          })
      }
  }
}
</script>

<style lang="less">
body {
  background: url(../../static/images/bg.jpg) no-repeat 0px 0px;
  background-size: cover;
  margin: 0;
}
</style>

