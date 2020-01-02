import { Vueact } from './instance';

new Vueact({
  el: '#app',
  data() {
    return {
      test: 'hello,world',
      show: true,
      testHtml: '<h1 style="color: red;">Hello HTML</h1>',
      aa: 5
    }
  },
  computed: {
    testcp() {
      console.log('call计算属性');
      return this.aa + 10;
    }
  },
  methods: {
    onClick() {
      this.aa = 100;
    }
  }
});