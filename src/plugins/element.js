import Vue from "vue";
import { Button } from "element-ui";
import { Form, FormItem } from "element-ui";
import { Input } from "element-ui";
import { Icon } from "element-ui";
import { Message } from "element-ui";
// Vue.use(Message)
Vue.prototype.$message = Message;
Vue.use(Icon);
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
