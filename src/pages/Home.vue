<template>
	<el-container>
	  <el-header>
	  	<div class="header">商户<span>{{username}}</span>，你好</div>
	  </el-header>
	  <el-container>
	    <el-aside width="200px">
	    	<nav class="nav">
	    		<ul>
	    			<li v-for="(item, index) in navList">
	    				<router-link :to="item.path" >{{item.name}}</router-link>
	    			</li>
	            </ul>
	    	</nav>
	    </el-aside>
	    <el-main><router-view></router-view></el-main>
	  </el-container>
	</el-container>
</template>

<script>
export default {
  name: 'Home',
  components: {},
  data () {
    return {
     	username: '渣渣辉',
     	navList: [
     		{'name': '商户号登记', 'path': '/home'},
     		{'name': '已登记商户号查询', 'path': '/search'}
     	],
    }
  },
  mounted() {
   
  }, 
  methods: {
  
  }
}
</script>

<style>
  .el-container{
    height:100%;   
  }
  .el-header{
    background: url('../../static/images/bg_header.png') no-repeat center center;
    background-size: 100% 100%;
  }  
  .el-aside {
    display:flex;
    height:100%;
  }
</style>

