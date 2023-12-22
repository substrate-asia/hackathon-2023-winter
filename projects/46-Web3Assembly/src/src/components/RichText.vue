<template>
  <div v-if="readOnly">
    <el-tiptap v-model="content" :readonly="true" :showMenubar="false" :extensions="extensions"
      placeholder="Write something ..." />
  </div>
  <div v-else>
    <el-tiptap v-model="content" :extensions="extensions" placeholder="Write something ..." />
  </div>
</template>
  
<script>
import {
  // all extensions
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Italic,
  Strike,
  Underline,
  Link,
  Image,
  Blockquote,
  ListItem,
  BulletList, // use with ListItem
  OrderedList, // use with ListItem
  TodoItem,
  TodoList, // use with TodoItem
  TextAlign,
  Indent,
  HorizontalRule,
  HardBreak,
  History,
  LineHeight,
  Iframe,
  CodeBlock,
  // TrailingNode,
  // Table, // use with TableHeader, TableCell, TableRow
  // TableHeader,
  // TableCell,
  // TableRow,
  // FormatClear,
  TextColor,
  TextHighlight,
  Preview,
  Print,
  Fullscreen,
  CodeView
  // SelectAll,
} from "element-tiptap";

import codemirror from "codemirror";
import "codemirror/lib/codemirror.css"; // import base style
import "codemirror/mode/xml/xml.js"; // language
import "codemirror/addon/selection/active-line.js"; // require active-line.js
import "codemirror/addon/edit/closetag.js"; // autoCloseTags
import { readonly } from "vue";

export default {
  name: "RichText",
  props: {
    readOnly: {
      type: Boolean,
      default: false,
    }
  },
  watch: {
    readOnly(newVal, oldVal) {
      if (newVal) {// readonly 模式
        //当前selectID
        console.log(newVal);
        var selectID = this.$store.state.selectID
        return this.$store.state.contents.find(contentByID => contentByID.id === selectID); // 暂时不考虑多个的情况
      }
    }
  },
  data: () => ({
    readExtensions: [
      new Doc(),
      new Text(),
      new Paragraph(),
      new Print(),
      new Image(),
      new Indent(),
    ],
    extensions: [
      new Doc(),
      new Text(),
      new Paragraph(),
      new Heading({ level: 5 }),
      new Bold({ bubble: true }),
      new Underline({ bubble: true }),
      new Italic({ bubble: true }),
      new Strike({ bubble: true }),
      new Link({ bubble: true }),
      new Image(),
      new Blockquote(),
      new TextAlign(),
      new ListItem(),
      new BulletList({ bubble: true }),
      new OrderedList({ bubble: true }),
      new TodoItem(),
      new TodoList(),
      new Indent(),
      new HardBreak(),
      new HorizontalRule({ bubble: true }),
      new Fullscreen(),
      new CodeView({
        codemirror,
        codemirrorOptions: {
          styleActiveLine: true,
          autoCloseTags: true
        }
      }),
      new Iframe(),
      new Print(),
      new History(),
      new LineHeight(),
      new CodeBlock(),
      new TextColor(),
      new TextHighlight(),
      new Preview()
    ],
    content: '',
    testContent1: `<h1>Taiko</h1><h3>Empowering Blockchain Scalability with zk Roll-Ups</h3><p>💡 Are you fascinated by blockchain technology and want to dive deeper into the world of scalability and privacy? Look no further than TAIKO Protocol! In this beginner-friendly introduction, we'll explore what TAIKO is, its background, value proposition, and its exciting use cases.</p><p></p><h3>🖼️Background: The Scaling Challenge</h3><p>Blockchain technology, famous for its security and transparency, has a scaling challenge. As more users join the network, transaction processing becomes slower and more expensive. This problem stems from the fact that every transaction must be validated by every node in the network, making it inefficient.</p><blockquote><p>This is where TAIKO Protocol comes into play.</p></blockquote><hr><h2>🥁TAIKO Protocol: A Scalability Solution</h2><p>TAIKO Protocol is a cutting-edge blockchain scalability solution that leverages zk Roll-Ups to address the scaling challenge. Let's break down what this means:</p><p>zk Roll-Ups: zk stands for "Zero-Knowledge," a cryptographic technique that allows you to prove that you know something without revealing the actual data. Roll-Ups, on the other hand, are a way to bundle multiple transactions off-chain and submit only a single proof to the main blockchain. This drastically reduces the computational load on the network.</p><h2>❓Why TAIKO?</h2><ul><li><p>⬆️&nbsp;Scalability:</p><p>TAIKO Protocol significantly boosts the scalability of blockchain networks. By batching transactions into zk Roll-Ups, it enables faster and more efficient processing, ensuring that the blockchain can handle a larger volume of transactions without congestion.</p></li><li><p>🔐&nbsp;Privacy:</p><p>Thanks to Zero-Knowledge Proofs, TAIKO Protocol offers enhanced privacy. Users can transact on the blockchain without revealing sensitive information, making it suitable for various applications, including finance and supply chain.</p></li><li><p>⚡&nbsp;Cost-Efficiency:</p><p>Reduced computational requirements mean lower transaction fees for users. TAIKO Protocol makes blockchain applications more accessible by decreasing the cost barrier.</p></li></ul><h2>👤Use Cases for TAIKO Protocol:</h2>`,
    testContent2: `<h2 style="text-align: center">Welcome To Element Tiptap Editor Demo</h2><p>🔥 <strong>Element Tiptap Editor </strong>🔥is a WYSIWYG rich-text editor using&nbsp; <a href="https://github.com/scrumpy/tiptap" rel="noopener noreferrer nofollow">tiptap</a>&nbsp;and <a href="https://github.com/ElemeFE/element" rel="noopener noreferrer nofollow">element-ui</a>&nbsp;for Vue.js <img src="https://i.ibb.co/nbRN3S2/undraw-upload-87y9.png" alt="" title="" height="200" data-display="right"> that\'s easy to use, friendly to developers, fully extensible and clean in design.</p><p></p><p style="text-align: right">👉Click on the image to get started image features 👉</p><p></p><p>You can switch to <strong>Code View </strong>💻 mode and toggle <strong>Fullscreen</strong> 📺 in this demo.</p><p></p><p><strong>Got questions or need help or feature request?</strong></p><p>🚀 <strong>welcome to submit an <a href="https://github.com/Leecason/element-tiptap/issues" rel="noopener noreferrer nofollow">issue</a></strong> 😊</p><p>I\'m continuously working to add in new features.</p><p></p><blockquote><p>This demo is simple, switch tab for more features.</p><p>All demos source code: <a href="https://github.com/Leecason/element-tiptap/blob/master/examples/views/Index.vue" rel="noopener noreferrer nofollow">source code 🔗</a></p></blockquote>`
  }),

  mounted() {
  },
  created() {
    if (this.readOnly) {
      var selectID = this.$store.state.selectID
      if (this.$store.state.contents.find(contentByID => contentByID.id === selectID)) {
        var content = this.$store.state.contents.find(contentByID => contentByID.id === selectID).content
        console.log(content);
        this.content = content
      } else {
        this.content = ''
      }
        
    }
  }
};
</script>
  