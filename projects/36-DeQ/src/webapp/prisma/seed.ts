import { PrismaClient } from '@prisma/client'
import dedent from 'dedent'

const prisma = new PrismaClient()

async function main() {
  const alice = await prisma.user.upsert({
    where: { handle: 'alice' },
    update: {},
    create: {
      name: 'alice',
      handle: 'alice',
      address: '0x8894E0a0c962CB723c1976a4421c95949bE2D4E3',
      questions: {
        create: [
          {
            title: '鸿蒙 3 图片智能打码功能疑似抄袭，开发者回应「谁能想到 DAMA 成鸿蒙核心功能了」，这算抄袭吗？',
            body: '是功能相似，刚好一前一后，还是真的抄袭？能否通过看源代码来判断？',
          },
          {
            title: 'iOS 系统的编译器和华为方舟编译器孰强孰弱？',
            body: '',
          },
          {
            title: '如何看待华为1100亿行规模的代码库？',
            body: dedent`
看到InfoQ的一个微信，里面介绍华为的源代码总行数 1100 亿、代码仓库数 60 万 +、每天下载容量 60 T、高峰并发下载达到 1 万次 / 秒……

想请问，这个规模的代码库在业界是怎么样的一个规模？

之前看到谷歌的代码库规模为10亿行左右。

但看微信里面的介绍，华为目前应该成功的解决了这个1100亿行代码库的托管难题，并且还能把能力对外提供。这个能力，在业界是排行到什么水平？
`
          },
        ]
      },
    },
  })

  await prisma.user.upsert({
    where: { handle: 'pansz' },
    update: {},
    create: {
      name: 'pansz',
      handle: 'pansz',
      address: '0x16Cc69739064489F16039859c3027AC542D03b1D',
      answers: {
        create: [
          {
            questionId: 3,
            tokenId: 1,
            body: dedent`
可能是时代变了，在知乎看到一众码农说自己的工作就是天天ctrl-c+ctrl-v的时候我本以为他们只是在调侃，毕竟我做了20年程序员，复制粘贴的场景还真的是极少。
但要是题主说的是真事的话，那一种合理的解释就是华为员工确实天天都在ctrlc+ctrlv，毕竟这个代码量，全美所有科技企业加起来都还远远比不上。
实际上，程序员的产出能力总是只有那么多，不会有数量级的差异，华为的员工数量就这个水平，但代码量是别人的几十上百倍，只能解释为疯狂复制粘贴。
所以：我觉得这个新闻不是真的，大概是专门用来黑华为的。这种数据反常识，而且疯狂复制粘贴说明代码冗余量大，复用效率低，代码量大到到这种离谱的程度，根本并不是什么光荣，而是耻辱。
哎，别再黑了，这黑的我华黑都看不下去了。
`,
          }
        ]
      }
    }
  })

  await prisma.user.upsert({
    where: { handle: 'zhangsan' },
    update: {},
    create: {
      name: 'zhangsan',
      handle: 'zhangsan',
      address: '0x87C8e61081b256eBcE9D39862F9c2ED98DC9CDCd',
      answers: {
        create: [
          {
            questionId: 3,
            tokenId: 2,
            body: dedent`
我第一天学着用vue的时候，我只写了一个hello world页面，运行的时候提示我，框架自动生成了98w行的js代码。。。
我上上家公司的VP，以前是给NASA写代码的，他写了一个4k大小的，控制火星云层中探测器姿态的程序，现在还跑在火星上。
所以代码和代码是不一样的，光轮行数没有用，你也得要看是什么代码
            `,
          }
        ]
      }
    }
  })

  await prisma.user.upsert({
    where: { handle: 'yaodong' },
    update: {},
    create: {
      name: 'yaodong',
      handle: 'yaodong',
      address: '0xE356298C49f5F509599f503F11F7fF3a2E6609a2',
      answers: {
        create: [
          {
            questionId: 2,
            tokenId: 3,
            body: dedent`
iOS 系统的编译器就是支持Objective C/C++/Swift前端的LLVM
目前为止，这个星球上还没有编译器有资格和LLVM比，实际上主流编译器不是在LLVM基础上开发的，就是模仿LLVM开发的，哪怕是GCC这种比LLVM古老的编译器也在向着LLVM的方向演进。
华为收买媒体发了大量方舟编译器的软文，导致大众对于编译器到底是什么产生了误解，作为专业软件开发人员对于编译器还是要有清楚的认知，起码编译原理要学一下，龙书一类的读物要看一看。
            `,
          }
        ]
      }
    }
  })

  await prisma.user.upsert({
    where: { handle: 'Himself65' },
    update: {},
    create: {
      name: 'Himself65',
      handle: 'Himself65',
      address: '0x7b2Aa02EfFAA3830429b94d58684954E1C0B331B',
      answers: {
        create: [
          {
            questionId: 2,
            tokenId: 4,
            body: dedent`
LLVM实现了的语言：Ruby, Python, Haskell, Java, D, PHP, Pure, Lua, Rust, Swift, C/C++(Clang), Objective-C等数不清的语言
方舟编译器呢？
另外，LLVM主repo不在GitHub上面，所以请不要说什么被美利坚卡脖子等阴谋论言论
你能Clone，我也能Clone，目前方舟编译器没有看到任何比LLVM的优势。
不爽就去PR代码，不要整天沸腾
            `,
          }
        ]
      }
    }
  })

  await prisma.user.upsert({
    where: { handle: 'baye' },
    update: {},
    create: {
      name: 'baye',
      handle: 'baye',
      address: '0xB9cB9c5D2fd7148141f8c7e17751c31D533fD153',
      answers: {
        create: [
          {
            questionId: 2,
            tokenId: 5,
            body: dedent`
我是 DAMA 的作者，本来没想参与这个话题，不过谬误实在太多，甚至说我抄袭鸿蒙，还是说两句。
DAMA 是 2020 年发布的，微信（还有一部分其它社交软件）用户头像、朋友圈自动打码是 2021 年5月发布的。根据网友的截图，鸿蒙的功能是 2021 年 6 月测试的，并在最近的鸿蒙3 中实现了其他功能。我不知道我是怎么提前预知到鸿蒙的开发计划并抄袭后提前发布的。
虽然两者的多个功能点及其相似，我自然也是知道软件的知识产权是不保护功能、交互的。所以我并没有说是鸿蒙抄袭 DAMA。只是在有用户 @ 我时，我就吐槽两句。
第一次是华为的李小龙，在微博上炫耀说“只有华为手机有这个功能”。我的一些用户在评论区向其证明 iOS App 早就有了（赞数太多都被其删掉了），并 @ 了我，我就揶揄了一下。
我没有什么诉求，因为就像很多华为用户骂我的那样，“功能一样，怎么能算抄袭呢？代码一样才是抄袭”。事实就是如此，维权的成本远远高于侵权的成本。从法理上认定软件抄袭，几乎是不可能完成的任务。
我自然是知道这一点，所以我从一开始就没有纠结在“抄袭”这个词语上。
**我只是在表达，你们开个发布会隆重宣传的这个创新哦，我早就做了。**
            `,
          }
        ]
      }
    }
  })
}


main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

