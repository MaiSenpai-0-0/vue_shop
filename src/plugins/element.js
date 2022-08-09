import Vue from "vue";
import { Button } from "element-ui";
import { Form, FormItem } from "element-ui";
import { Input } from "element-ui";
import { Icon } from "element-ui";
import {
  Message,
  Header,
  Container,
  Aside,
  Main,
  Submenu,
  Menu,
  MenuItem,
  MenuItemGroup,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Col,
  Row,
  Table,
  TableColumn,
  Switch,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option,
  Cascader
} from "element-ui";
// Vue.use(Message)
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.use(Cascader)
Vue.use(Tree);
Vue.use(Select);
Vue.use(Option);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Card);
Vue.use(Switch);
Vue.use(TableColumn);
Vue.use(Tag);
Vue.use(Table);
Vue.use(Row);
Vue.use(Col);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Icon);
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Header);
Vue.use(Container);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItemGroup);
Vue.use(MenuItem);
