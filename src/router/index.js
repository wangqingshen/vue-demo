import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/Login'
import Index from '@/pages/Index'
import Home from '@/pages/Home'
import ChangePwd from '@/components/ChangePwd'
import Search from '@/components/Search'
import CheckIn from '@/components/CheckIn'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      children: [
      	{         
          path: 'changePwd',
          component: ChangePwd
      	},
      	{         
          path: 'search',
          component: Search
      	},
      	{         
          path: 'checkIn',
          component: CheckIn
      	}
      ]
    },
  ]
})
