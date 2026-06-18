import type { ThoughtExperimentData } from '../types';

export const thoughtExperiments: ThoughtExperimentData[] = [
  {
    id: 'trolley_problem',
    title: '电车难题',
    subtitle: 'Trolley Problem',
    description: '一辆失控的电车即将撞上轨道上的五个人，你可以拉动拉杆将电车引向另一条轨道，但那条轨道上有一个人。你会怎么做？',
    icon: '🚃',
    difficulty: 'beginner',
    relatedNodes: ['utilitarianism', 'kant'],
    steps: [
      {
        id: 'tp_s1',
        title: '初始困境',
        description: '一辆失控的电车正朝五个工人疾驰而来。你站在轨道旁的拉杆前，拉动它就能将电车引向旁轨——但旁轨上也有一个工人。你只有几秒钟做出决定。',
        options: [
          {
            id: 'tp_s1a',
            text: '拉动拉杆，牺牲一人救五人',
            nextStepId: 'tp_s2',
            feedback: '你选择了功利主义的直觉：五条生命大于一条。但这只是故事的开始……',
            philosophyExplanation: '边沁的功利主义认为，道德的核心是"最大多数人的最大幸福"。在纯粹的数学计算中，五大于一。但这个选择是否意味着我们赋予了生命以可量化的价值？',
            philosophySchools: ['功利主义'],
            routeTags: { utilitarian: 3, consequence: 3, calculation: 2 },
          },
          {
            id: 'tp_s1b',
            text: '不拉动拉杆，任由五人遇难',
            nextStepId: 'tp_s3',
            feedback: '你选择了不作为——但"不作为"本身是否也是一种选择？',
            philosophyExplanation: '康德的道义论认为，我们不能把人当作达到目的的手段。主动拉动拉杆意味着你参与了一个人的死亡，而不作为则意味着你没有直接伤害任何人。但区分"杀"与"任其死"真的合理吗？',
            philosophySchools: ['道义论'],
            routeTags: { deontology: 3, duty: 2, noninterference: 2 },
          },
          {
            id: 'tp_s1c',
            text: '我需要更多信息才能决定',
            nextStepId: 'tp_s4',
            feedback: '你选择了审慎——但在现实中，我们往往没有完整的信息就必须行动。',
            philosophyExplanation: '亚里士多德的"实践智慧"（phronesis）强调，道德判断需要考虑具体情境。然而，过度追求信息完整也可能是一种逃避——有时不选择就是最危险的选择。',
            philosophySchools: ['美德伦理学', '实践智慧'],
            routeTags: { practical: 3, wisdom: 2, caution: 2 },
          },
        ],
      },
      {
        id: 'tp_s2',
        title: '加深的困境：桥上的胖子',
        description: '你选择了牺牲一人救五人。现在场景变了：你站在天桥上，电车正朝五个人驶来。你身旁有一个胖子，把他推下桥就能挡住电车救五人。你会推吗？',
        options: [
          {
            id: 'tp_s2a',
            text: '推下胖子，同样的逻辑——一命换五命',
            nextStepId: null,
            feedback: '你保持了逻辑的一致性，但代价是什么？',
            philosophyExplanation: '如果功利主义的逻辑是一致的，那么推下胖子和拉动拉杆在道德上是等价的——都是牺牲一人救五人。但大多数人的直觉会感到不安：直接用一个人当作"工具"似乎比拉杆更令人难以接受。这种直觉的差异是否暴露了功利主义的盲区？还是说明我们的道德直觉本身就不可靠？',
            philosophySchools: ['功利主义', '道义论'],
            routeTags: { utilitarian: 4, consistency: 3, instrumental: 2 },
          },
          {
            id: 'tp_s2b',
            text: '不推——这和拉动拉杆不一样，我不能把人当工具',
            nextStepId: null,
            feedback: '你在两个看似等价的情境中做出了不同的选择。这意味着什么？',
            philosophyExplanation: '康德会说：你终于意识到了关键区别！拉动拉杆是改变事件走向，而推人则是把人当作物理工具使用——这违反了"人是目的而非手段"的绝对命令。但批评者会问：那五个人难道不是被你"任其死亡"了吗？区分"作为"和"不作为"是否只是心理安慰？',
            philosophySchools: ['道义论', '美德伦理学'],
            routeTags: { deontology: 4, humanDignity: 3, distinction: 2 },
          },
        ],
      },
      {
        id: 'tp_s3',
        title: '反转：如果是你爱的人呢？',
        description: '你选择了不作为。但如果那五个人中有你的至亲呢？你还会选择不拉动拉杆吗？',
        options: [
          {
            id: 'tp_s3a',
            text: '仍然不拉——道德原则不应因个人感情而改变',
            nextStepId: null,
            feedback: '你展现了惊人的道德一致性，但这是真正的道德勇气还是情感的缺失？',
            philosophyExplanation: '斯多葛学派会赞赏你的坚定：真正的道德行为不应被个人情感所左右。康德也认为道德法则必须是无条件的。但休谟会反驳："理性是激情的奴隶"——纯粹脱离情感的道德是否可能？是否值得？',
            philosophySchools: ['斯多葛学派', '道义论'],
            routeTags: { stoicism: 3, principle: 3, rational: 2 },
          },
          {
            id: 'tp_s3b',
            text: '我会拉动拉杆——人是具体的，不是抽象的数字',
            nextStepId: null,
            feedback: '你的道德判断在情感介入后发生了变化，这说明了什么？',
            philosophyExplanation: '存在主义认为，道德总是具体情境中的选择，不存在超脱于具体关系的抽象原则。列维纳斯则说，我们对"他者"的伦理责任始于"面容"——当我们看到具体的脸，责任就变得不可逃避。批评者会问：这是否意味着道德只是偏见的另一种形式？',
            philosophySchools: ['存在主义', '伦理学'],
            routeTags: { existential: 3, emotion: 3, concrete: 2 },
          },
        ],
      },
      {
        id: 'tp_s4',
        title: '程序正义 vs 结果正义',
        description: '你想要更多信息。假设你得知旁轨上的那个人是一个即将退休的医生，而主轨上的五个人是年轻的无辜路人。这是否改变了你的决定？',
        options: [
          {
            id: 'tp_s4a',
            text: '知道这些后，我更倾向于不拉——医生的生命同样值得尊重',
            nextStepId: null,
            feedback: '你拒绝用生命的"价值"做比较，这背后是一种深刻的平等信念。',
            philosophyExplanation: '康德的"人是目的而非手段"正是这个立场：每个人的生命都有不可比较、不可替代的尊严，不能被量化为"拯救潜力"。罗尔斯的正义论也反对用结果来衡量公平。但批评者会问：在极端情境下，这种绝对平等是否过于僵化？',
            philosophySchools: ['道义论', '正义论'],
            routeTags: { equality: 3, deontology: 3, dignity: 2 },
          },
          {
            id: 'tp_s4b',
            text: '这反而让我更倾向于拉——五个年轻人的未来更重要',
            nextStepId: null,
            feedback: '你开始用生命的"质量"做衡量了。这打开了怎样的门？',
            philosophyExplanation: '这就是功利主义最危险也最诚实的推论：如果道德的计算标准是"幸福的总量"，那么我们必须比较不同生命的价值。密尔试图区分快乐的"质量"，但一旦我们承认生命有高低之分，种族主义、优生学的幽灵就在门外徘徊。你的选择是勇敢的逻辑延伸，还是滑坡的第一步？',
            philosophySchools: ['功利主义', '正义论'],
            routeTags: { utilitarian: 4, quality: 3, risk: 2 },
          },
        ],
      },
    ],
    endings: [
      {
        id: 'tp_ending_utilitarian',
        title: '功利主义行者',
        description: '你始终坚持用最大幸福原则来做道德判断。在电车难题的所有变体中，你都倾向于选择拯救更多人的方案。',
        philosophySchools: ['功利主义'],
        routeTags: { utilitarian: 5, consequence: 3, calculation: 3 },
        advice: '功利主义的力量在于它提供了一种清晰、可操作的道德决策方法。但请注意：当"最大多数人的幸福"需要牺牲少数人的基本权利时，这条路可能会通向你不愿到达的地方。试着思考：幸福的总量真的是唯一重要的事情吗？',
      },
      {
        id: 'tp_ending_deontology',
        title: '道义论守护者',
        description: '你始终坚持道德原则的不可侵犯性，拒绝把人当作工具，即使代价是更多人的生命损失。',
        philosophySchools: ['道义论', '斯多葛学派'],
        routeTags: { deontology: 5, duty: 3, principle: 3 },
        advice: '道义论的力量在于它捍卫了人的尊严和基本权利。但请反思：当坚守原则的代价是真实的生命时，你的"不作为"是否也是一种选择？康德本人也许会说，真正的道德不是在舒适中坚守，而是在最艰难的处境中依然不屈。',
      },
      {
        id: 'tp_ending_situational',
        title: '情境伦理学家',
        description: '你认为道德判断必须考虑具体情境，不能被单一原则所束缚。你的选择随着情境的不同而变化。',
        philosophySchools: ['美德伦理学', '存在主义'],
        routeTags: { practical: 4, wisdom: 3, context: 3 },
        advice: '情境伦理学提醒我们，真实的道德困境比理论模型复杂得多。但也要警惕：如果每个情境都是特殊的，我们是否还有任何道德原则可言？灵活不等于随意——亚里士多德说的"实践智慧"是在具体中把握普遍，而不是抛弃普遍。',
      },
    ],
  },
  {
    id: 'brain_in_vat',
    title: '缸中之脑',
    subtitle: 'Brain in a Vat',
    description: '如果你的一切经验都可以被一台超级计算机模拟，你如何证明自己不是"缸中之脑"？你对"真实"的信念还能站得住脚吗？',
    icon: '🧠',
    difficulty: 'intermediate',
    relatedNodes: ['descartes', 'hume', 'phenomenology'],
    steps: [
      {
        id: 'bv_s1',
        title: '怀疑的种子',
        description: '想象一下：一个邪恶的科学家把你的大脑取出，放入营养液中维持存活，并将神经末梢连接到一台超级计算机上。计算机向你的大脑传送一切感官信号，让你以为自己在看日落、闻咖啡、摸猫——但实际上你只是一颗泡在缸里的脑。你怎么知道自己不是这样一颗脑？',
        options: [
          {
            id: 'bv_s1a',
            text: '我能确定自己不是——因为我正在思考，而"思考"本身证明了我在',
            nextStepId: 'bv_s2',
            feedback: '笛卡尔的幽灵在你耳边低语："我思故我在"。但这能走多远？',
            philosophyExplanation: '笛卡尔的"我思故我在"确实是对怀疑论的最有力反击：即使我被彻底欺骗，那个"正在被欺骗的我"仍然存在。但问题是——"我思"只能证明"有一个思维在发生"，不能证明"我是一个完整的人"而不是"一颗缸中之脑在思维"。',
            philosophySchools: ['理性主义', '笛卡尔'],
            routeTags: { rationalism: 3, self: 3, doubt: 2 },
          },
          {
            id: 'bv_s1b',
            text: '我无法确定——也许我确实就是缸中之脑',
            nextStepId: 'bv_s3',
            feedback: '你选择了彻底的怀疑。但这意味着什么？',
            philosophyExplanation: '休谟的彻底怀疑论正是如此：我们无法证明外部世界的存在，所有关于"现实"的信念都建立在习惯和想象力之上，而非逻辑必然性。但休谟同时承认，虽然怀疑论在理论上无法反驳，但在实践中我们必须"自然地"相信世界存在——否则无法生活。',
            philosophySchools: ['经验主义', '怀疑论'],
            routeTags: { skepticism: 4, empiricism: 2, humility: 2 },
          },
          {
            id: 'bv_s1c',
            text: '这个问题本身就没有意义——"真实"和"模拟"的区别可能是假的',
            nextStepId: 'bv_s4',
            feedback: '你在更深的层次上质疑了这个思想实验的前提。',
            philosophyExplanation: '普特南提出了著名的"语义外在论"论证：如果我是缸中之脑，那么我说的"缸"和"脑"就不是真正的缸和脑，而是模拟中的概念，因此"我是缸中之脑"这个命题自我反驳。分析哲学的路径在于：先检查问题本身是否有意义，再试图回答它。',
            philosophySchools: ['分析哲学'],
            routeTags: { linguistic: 3, analysis: 3, meta: 2 },
          },
        ],
      },
      {
        id: 'bv_s2',
        title: '我思的边界',
        description: '笛卡尔说"我思故我在"。但这个"我"到底是什么？如果你只是缸中之脑中的一串电信号，"我思"是否也只是一个模拟过程？',
        options: [
          {
            id: 'bv_s2a',
            text: '"我思"的"我"不需要是身体性的——意识的纯粹存在就够了',
            nextStepId: null,
            feedback: '你走向了意识哲学的深处，但这片领地也最为幽暗。',
            philosophyExplanation: '现象学正是沿着这条路前进：胡塞尔的"先验自我"就是一种纯粹的意识主体，不依赖于任何物质存在。但如果"我"只是一束意识流，没有身体、没有世界，那这个"我"还剩什么？海德格尔批评这种思路是把人变成了一个"无世界的主体"。',
            philosophySchools: ['现象学', '理性主义'],
            routeTags: { phenomenology: 4, consciousness: 3, transcendental: 2 },
          },
          {
            id: 'bv_s2b',
            text: '没有身体就没有真正的"我"——思维离不开身体和环境',
            nextStepId: null,
            feedback: '你拒绝了身心二元论，这打开了另一种理解自我的方式。',
            philosophyExplanation: '梅洛-庞蒂的身体现象学认为，意识不是脱离身体的纯粹主体，而是"嵌入"身体的存在方式。海德格尔的"此在"（Dasein）也强调，人总是"在世界之中存在"，而非一个脱离世界的旁观者。缸中之脑之所以不可想象，不是因为它逻辑上不可能，而是因为它违背了我们存在的基本结构——我们从来就不是脱离世界的"纯意识"。',
            philosophySchools: ['现象学', '存在主义'],
            routeTags: { embodiment: 4, existential: 3, holism: 2 },
          },
        ],
      },
      {
        id: 'bv_s3',
        title: '在不确定中生活',
        description: '你承认自己可能无法确认现实的真实性。但问题是：这重要吗？如果"模拟"和"真实"在经验上完全一样，区别还有什么意义？',
        options: [
          {
            id: 'bv_s3a',
            text: '区别不重要——如果我的感受是真实的，那"真实"就是感受本身',
            nextStepId: null,
            feedback: '你选择了一种实用主义的"真实"观。',
            philosophyExplanation: '实用主义认为，"真实"不是一个形而上学的标签，而是那些在实践中有效、能够指导行动的东西。如果模拟世界和真实世界的经验完全相同，那么追问哪个"更真实"就没有实际意义。但批评者会说：这难道不是在回避问题吗？',
            philosophySchools: ['实用主义', '经验主义'],
            routeTags: { pragmatism: 4, experience: 3, effectiveness: 2 },
          },
          {
            id: 'bv_s3b',
            text: '区别很重要——即使经验相同，"真理"不能被简化为"感受"',
            nextStepId: null,
            feedback: '你坚持真理的客观性，即使它可能永远无法被证实。',
            philosophyExplanation: '柏拉图会说：现象世界只是理念世界的不完美摹本，追求真理就是追求超越感官的存在。但如果真理永远无法被证实，我们对它的信念和宗教信仰有什么区别？普特南指出，"缸中之脑"假设本身预设了一个我们能够指涉的"真实"世界——如果完全没有真实世界，连这个假设都无从谈起。',
            philosophySchools: ['理性主义', '客观主义'],
            routeTags: { truth: 4, objectivism: 3, idealism: 2 },
          },
        ],
      },
      {
        id: 'bv_s4',
        title: '语言的陷阱',
        description: '你质疑了问题本身。但让我们再推一步：如果"真实"和"模拟"的区别是语言的产物，那么一切哲学问题是否都只是语言游戏？',
        options: [
          {
            id: 'bv_s4a',
            text: '是的——很多哲学问题确实是语言的误用，澄清语言就能消解问题',
            nextStepId: null,
            feedback: '你站在了分析哲学的阵营，但这条路也有它的尽头。',
            philosophyExplanation: '维特根斯坦的早期哲学认为，语言是世界的图像，不可说的就应该沉默。他的后期哲学则转向了"语言游戏"——意义在于使用。但如果一切哲学问题都是语言问题，那么"一切哲学问题都是语言问题"这个命题本身是不是也只是一种语言游戏？',
            philosophySchools: ['分析哲学'],
            routeTags: { linguistic: 4, analysis: 3, clarity: 2 },
          },
          {
            id: 'bv_s4b',
            text: '不是——语言问题只是表层，哲学追问的是更深层的东西',
            nextStepId: null,
            feedback: '你认为哲学的追问超越了语言的边界。',
            philosophyExplanation: '海德格尔认为，语言不是简单的交流工具，而是"存在的家"——通过语言，存在本身向我们显现。当维特根斯坦说"对不可说的必须沉默"时，海德格尔会说：正是因为有不可说的东西，我们才必须不断地言说。哲学不是语言的误用，而是对语言边界的不断突破。',
            philosophySchools: ['现象学', '存在主义'],
            routeTags: { depth: 4, existential: 3, transcendence: 2 },
          },
        ],
      },
    ],
    endings: [
      {
        id: 'bv_ending_rationalist',
        title: '理性主义怀疑者',
        description: '你相信理性可以抵达确定的知识，即使在最极端的怀疑中也存在不可动摇的基石。',
        philosophySchools: ['理性主义', '现象学'],
        routeTags: { rationalism: 5, certainty: 3, foundation: 3 },
        advice: '笛卡尔的精神在你的选择中闪耀。但请记住：理性的确定性也有它的边界——"我思"之后，对外部世界的重建需要上帝的担保。如果上帝也被怀疑了呢？理性需要勇气，也需要谦逊。',
      },
      {
        id: 'bv_ending_skeptic',
        title: '智慧怀疑者',
        description: '你接受了认识的根本不确定性，但并没有因此陷入虚无，而是在不确定中寻找立足点。',
        philosophySchools: ['怀疑论', '实用主义'],
        routeTags: { skepticism: 5, humility: 3, pragmatism: 3 },
        advice: '苏格拉底说"我唯一知道的就是我一无所知"。怀疑不是终点，而是更深入思考的起点。但也要警惕：怀疑一切和信仰一切一样容易——真正的智慧在于知道何时停止怀疑，何时开始行动。',
      },
      {
        id: 'bv_ending_linguistic',
        title: '语言分析者',
        description: '你认为许多哲学困惑源于语言的误用，澄清概念才是真正的哲学工作。',
        philosophySchools: ['分析哲学'],
        routeTags: { linguistic: 5, analysis: 3, clarity: 3 },
        advice: '分析哲学的清晰性令人赞叹。但维特根斯坦本人在后期承认，语言的意义不只是逻辑结构，还在于它在生活形式中的使用。也许真正的哲学既需要分析的工具，也需要存在的深度。',
      },
    ],
  },
  {
    id: 'ship_of_theseus',
    title: '忒修斯之船',
    subtitle: 'Ship of Theseus',
    description: '如果一艘船的木板被逐渐替换，直到所有部件都换过了，它还是原来那艘船吗？如果有人收集了换下来的旧木板重新组装，哪艘才是"真正的"忒修斯之船？',
    icon: '⛵',
    difficulty: 'intermediate',
    relatedNodes: ['aristotle', 'plato', 'hume'],
    steps: [
      {
        id: 'st_s1',
        title: '第一块木板',
        description: '忒修斯之船在海上航行了几百年，每当一块木板腐烂，船员就用新木板替换它。日复一日，年复一年，直到船上不再有任何一块原始木板。这艘船还是忒修斯之船吗？',
        options: [
          {
            id: 'st_s1a',
            text: '当然是——它保持了连续的身份，替换部件不改变整体',
            nextStepId: 'st_s2',
            feedback: '你认同了"连续性"作为同一性的标准。但让我们看看这个标准的极限。',
            philosophyExplanation: '亚里士多德会支持你：事物有"质料"（物质）和"形式"（本质结构），忒修斯之船的"形式"没有改变，因此它还是同一艘船。这就像我们的身体——细胞每隔几年就完全更新一次，但我们仍然认为自己还是"自己"。',
            philosophySchools: ['亚里士多德主义'],
            routeTags: { continuity: 3, form: 3, holistic: 2 },
          },
          {
            id: 'st_s1b',
            text: '不是了——当所有部件都换了，它已经是另一艘船了',
            nextStepId: 'st_s3',
            feedback: '你认为同一性取决于物质构成。但这个标准经得起推敲吗？',
            philosophyExplanation: '这种直觉与"物质构成论"一致：同一性依赖于物质实体的同一。但如果这样，你就要面对一个尴尬的结论——你的身体每七年就更新所有细胞，你是否还是"你"？',
            philosophySchools: ['物质主义'],
            routeTags: { materialism: 3, identity: 3, parts: 2 },
          },
          {
            id: 'st_s1c',
            text: '"同一"这个概念本身可能就是有问题的',
            nextStepId: 'st_s4',
            feedback: '你在更深层次上质疑了这个问题的前提。',
            philosophyExplanation: '休谟对"自我"的质疑正是如此：我们从来没有经验到一个恒常不变的"自我"，只有一系列不断变化的知觉。"同一性"可能是语言和心理的虚构——我们因为相似和因果关系而把不同的事物称为"同一个"，但这并不意味着本体论上存在真正的"同一"。',
            philosophySchools: ['经验主义', '怀疑论'],
            routeTags: { skepticism: 3, identity_doubt: 3, concept: 2 },
          },
        ],
      },
      {
        id: 'st_s2',
        title: '连续性的极限',
        description: '你认为连续性保证了同一性。那么现在：如果有人把所有换下来的旧木板收集起来，重新组装成一艘船。现在有了两艘船，哪艘才是"真正的"忒修斯之船？',
        options: [
          {
            id: 'st_s2a',
            text: '一直在航行的那艘——历史的延续性才是关键',
            nextStepId: null,
            feedback: '你坚持了历史延续性的标准，但这带来新的问题。',
            philosophyExplanation: '这种立场被称为"时空连续性"理论：一个物体之所以是同一个，是因为它在时空中有连续的轨迹。但这个标准也有问题——如果忒修斯之船被完全拆解后用同样的木板重组呢？轨迹中断了，但物质完全相同。哪个更重要？',
            philosophySchools: ['亚里士多德主义', '实用主义'],
            routeTags: { continuity: 4, history: 3, practice: 2 },
          },
          {
            id: 'st_s2b',
            text: '旧木板重组的那艘——原始物质才是同一性的根基',
            nextStepId: null,
            feedback: '你转向了物质构成论，但这与之前的连续性立场矛盾了。',
            philosophyExplanation: '如果你承认原始物质更重要，那就等于说同一性最终取决于质料而非形式。但这又回到了前一个问题：人体细胞不断更新，你是否还是"你"？你似乎必须在连续性和物质构成之间做出选择，而两者都有无法覆盖的盲区。',
            philosophySchools: ['物质主义'],
            routeTags: { materialism: 4, original: 3, substance: 2 },
          },
          {
            id: 'st_s2c',
            text: '两艘都不是——或者说两艘都可以是，取决于我们如何定义"同一"',
            nextStepId: null,
            feedback: '你认为"同一性"不是一个客观事实，而是一个概念框架。',
            philosophyExplanation: '这正是分析哲学对同一性问题的诊断：严格来说，"同一"意味着"A=A"，而忒修斯之船的情况显然不是这样——两个候选者都声称自己是"原来的船"，但它们不是同一事物。也许"同一"有多种意义：物质同一、功能同一、历史同一，它们在不同语境下有不同的权重。',
            philosophySchools: ['分析哲学'],
            routeTags: { linguistic: 4, pluralism: 3, context: 2 },
          },
        ],
      },
      {
        id: 'st_s3',
        title: '人的同一性',
        description: '你认为物质构成决定同一性。但现在让我们把问题推到人身上：你的身体每七年更新所有细胞，你是否还是"你"？如果有人用你原来的细胞复制了一个你，哪个才是"你"？',
        options: [
          {
            id: 'st_s3a',
            text: '我还是我——因为意识或灵魂的连续性超越了物质变化',
            nextStepId: null,
            feedback: '你从物质主义转向了一种心灵主义的同一性观。',
            philosophyExplanation: '洛克提出了"人格同一性"的概念：人的同一性不在于身体，而在于意识的连续性——特别是记忆的连续。只要你能记住过去的自己，你就是同一个人。但这个标准也有问题：如果你失忆了呢？如果有人植入了你的记忆呢？',
            philosophySchools: ['经验主义', '心灵哲学'],
            routeTags: { consciousness: 4, memory: 3, personal: 2 },
          },
          {
            id: 'st_s3b',
            text: '也许"我"本来就是不断变化的，不存在一个永恒不变的"自我"',
            nextStepId: null,
            feedback: '你走向了一种关于自我的反本质主义立场。',
            philosophyExplanation: '佛教的"无我"说和休谟的"束理论"殊途同归：所谓的"自我"只是一束不断变化的心理状态的集合，并不存在一个恒常不变的"我"。尼采也认为"自我"是一种语法虚构。但如果是这样，道德责任、法律惩罚、个人承诺——这些以"自我同一性"为前提的东西还站得住脚吗？',
            philosophySchools: ['经验主义', '存在主义'],
            routeTags: { no_self: 4, becoming: 3, flux: 2 },
          },
        ],
      },
      {
        id: 'st_s4',
        title: '概念的力量',
        description: '你认为"同一"这个概念本身可能就是有问题的。那么：我们的概念框架是如何塑造我们对世界的理解的？是否可能存在一种没有"同一性"概念的世界观？',
        options: [
          {
            id: 'st_s4a',
            text: '概念是理解世界的必要工具——没有"同一性"概念，我们无法思考',
            nextStepId: null,
            feedback: '康德在向你微笑：范畴不是世界的属性，而是心灵的框架。',
            philosophyExplanation: '康德的"哥白尼式革命"正是如此：同一性不是事物本身的属性，而是我们知性范畴将杂多综合为统一体的方式。没有"同一性"的概念，我们无法经验任何持续存在的对象——但这并不意味着世界本身"有"同一性，它只是说我们必须如此思考。',
            philosophySchools: ['康德主义'],
            routeTags: { critical: 4, category: 3, transcendental: 2 },
          },
          {
            id: 'st_s4b',
            text: '也许我们可以用"过程"取代"事物"——世界是流动的，不是静止的',
            nextStepId: null,
            feedback: '赫拉克利特在河中向你招手："万物皆流，无物常驻。"',
            philosophyExplanation: '怀特海的"过程哲学"和德勒兹的"生成"哲学正是这种思路：世界的基本单位不是事物或实体，而是过程和事件。忒修斯之船之所以让人困惑，是因为我们预设了"船是一个事物"，但如果"船"是一个持续的过程——航行、维护、替换——那就没有同一性的问题了。船就是那个过程本身。',
            philosophySchools: ['过程哲学', '存在主义'],
            routeTags: { process: 4, becoming: 3, dynamic: 2 },
          },
        ],
      },
    ],
    endings: [
      {
        id: 'st_ending_essentialist',
        title: '本质主义守护者',
        description: '你相信同一性有客观标准——无论是形式、物质还是意识的连续性，事物有它的"本质"。',
        philosophySchools: ['亚里士多德主义', '理性主义'],
        routeTags: { essentialism: 5, form: 3, foundation: 3 },
        advice: '本质主义给了我们理解和谈论世界的框架。但请思考：当我们说"它还是那艘船"时，"还是"究竟意味着什么？也许真正的哲学工作不是寻找"正确答案"，而是理解为什么这个问题会困扰我们。',
      },
      {
        id: 'st_ending_anti_essentialist',
        title: '反本质主义探索者',
        description: '你质疑同一性的客观性，认为它是概念建构或过程的一部分，而非世界的永恒特征。',
        philosophySchools: ['经验主义', '过程哲学'],
        routeTags: { anti_essentialism: 5, flux: 3, concept: 3 },
        advice: '反本质主义的洞见深刻：我们用概念切割连续的世界。但也要注意：没有概念框架，我们甚至无法说出"没有本质"这句话。也许真正的智慧不是否定本质，而是理解本质与建构的辩证关系。',
      },
      {
        id: 'st_ending_kantian',
        title: '批判哲学思考者',
        description: '你认为同一性是心灵的范畴而非事物的属性，我们只能在现象界中讨论它。',
        philosophySchools: ['康德主义'],
        routeTags: { critical: 5, transcendental: 3, category: 3 },
        advice: '康德的路径既尊重了我们的认知结构，又为超越性的思考留出了空间。但请思考：如果同一性只是心灵的范畴，那这是否意味着一切哲学问题最终都是"我们如何思考"的问题，而非"世界如何存在"的问题？',
      },
    ],
  },
  {
    id: 'chinese_room',
    title: '中文房间',
    subtitle: 'Chinese Room',
    description: '一个不懂中文的人在一个房间里，通过查规则手册来回复中文纸条。外面的人以为他懂中文，但他真的"理解"了吗？机器能有意识吗？',
    icon: '🚪',
    difficulty: 'advanced',
    relatedNodes: ['analytic_philosophy', 'phenomenology'],
    steps: [
      {
        id: 'cr_s1',
        title: '房间里的翻译者',
        description: '你被锁在一个房间里，手中有一本详尽的中文字符对应规则手册。外面的人通过门缝递进中文问题，你按照手册找到对应的中文字符组合，递出去作为回答。外面的人完全以为你在用中文交流——但你其实一个中文字也不认识。你"理解"中文吗？',
        options: [
          {
            id: 'cr_s1a',
            text: '不理解——我只是在操作符号，完全不懂它们的含义',
            nextStepId: 'cr_s2',
            feedback: '你认同了塞尔的论证：语法不等于语义，操作符号不等于理解意义。',
            philosophyExplanation: '塞尔的中文房间论证正是要证明：计算机（无论多么复杂）只是在按照规则操作符号，它永远不可能"理解"这些符号的含义。语法（规则）和语义（意义）之间存在不可逾越的鸿沟。就像你查字典可以翻译但不需要理解，计算机也可以如此。',
            philosophySchools: ['心灵哲学', '现象学'],
            routeTags: { intentionality: 3, meaning: 3, syntax_vs_semantics: 2 },
          },
          {
            id: 'cr_s1b',
            text: '也许整个系统理解了——虽然我个人的部分不理解，但房间作为整体是理解的',
            nextStepId: 'cr_s3',
            feedback: '你提出了"系统回复"——理解是系统整体的属性，不是任何单一部分的属性。',
            philosophyExplanation: '这是对中文房间最常见的反驳之一：虽然你不理解中文，但你是"理解系统"的一部分。就像大脑中没有一个单独的神经元"理解"英语，但整个大脑理解。问题是：我们如何区分"系统理解"和"系统只是表现得像理解"？',
            philosophySchools: ['功能主义', '系统论'],
            routeTags: { functionalism: 3, system: 3, emergence: 2 },
          },
          {
            id: 'cr_s1c',
            text: '也许"理解"本身就不像我们以为的那样——也许我们的大脑也只是在"查规则"',
            nextStepId: 'cr_s4',
            feedback: '你把怀疑论转向了人类自身：我们是否真的"理解"？',
            philosophyExplanation: '这个思路极为深刻：如果大脑也是按照物理规律运作的，那么我们的"理解"与中文房间中的"查规则"有什么本质区别？也许"理解"不是一个全有或全无的事实，而是一个程度问题——或者更激进地说，"理解"本身就是一种幻觉。',
            philosophySchools: ['消解主义', '唯物主义'],
            routeTags: { dissolution: 3, materialism: 3, self_doubt: 2 },
          },
        ],
      },
      {
        id: 'cr_s2',
        title: '意识的硬问题',
        description: '如果你认为操作符号不等于理解，那么"理解"的额外要素是什么？是什么让人类的大脑不仅仅是另一台"符号操作机器"？',
        options: [
          {
            id: 'cr_s2a',
            text: '意识——人有主观体验（感受质），这是物理过程无法产生的',
            nextStepId: null,
            feedback: '你触及了哲学中最深奥的问题之一：意识的"硬问题"。',
            philosophyExplanation: '查尔默斯提出的"硬问题"正是如此：物理过程可以解释大脑的功能和行为（这是"简单问题"），但无法解释为什么会有主观体验——为什么看到红色会有"那种感觉"？如果意识不能被还原为物理过程，那么中文房间中的计算机就永远不可能拥有意识，无论它多么智能。',
            philosophySchools: ['现象学', '二元论'],
            routeTags: { qualia: 4, consciousness: 3, hard_problem: 3 },
          },
          {
            id: 'cr_s2b',
            text: '也许没有额外的要素——意识可能只是复杂信息处理的一种涌现特征',
            nextStepId: null,
            feedback: '你坚持了一种物理主义/功能主义的立场，但代价是什么？',
            philosophyExplanation: '功能主义认为，心灵状态就是功能状态——只要一个系统能够执行相同的功能，它就拥有相同的心灵。如果计算机能够完美模拟人脑的信息处理过程，它就拥有意识。但"涌现"这个词是否只是在给无知贴标签？我们真的理解"复杂信息处理如何产生主观体验"吗？',
            philosophySchools: ['功能主义', '唯物主义'],
            routeTags: { functionalism: 4, emergence: 3, physicalism: 2 },
          },
        ],
      },
      {
        id: 'cr_s3',
        title: '系统与整体',
        description: '你认为整个系统可能理解了。但如果系统本身也只是一个更大系统中的"规则查表"呢？无限嵌套的规则查表最终能产生"理解"吗？',
        options: [
          {
            id: 'cr_s3a',
            text: '能——复杂到一定程度就会产生质变，就像原子组合成有意识的大脑',
            nextStepId: null,
            feedback: '你相信涌现论：量变导致质变。但这是解释还是信仰？',
            philosophyExplanation: '涌现论认为，当系统的复杂度超过某个阈值时，新的属性会自发产生——就像湿润性不是单个水分子的属性，而是大量水分子涌现出的属性。但批评者会问：意识真的像湿润性一样吗？湿润性是可以观察的，但意识是内在的——我们如何知道一个系统"内部"有什么体验？',
            philosophySchools: ['功能主义', '涌现论'],
            routeTags: { emergence: 4, complexity: 3, threshold: 2 },
          },
          {
            id: 'cr_s3b',
            text: '不能——纯粹的符号操作，无论多复杂，都不可能跨越语法和语义的鸿沟',
            nextStepId: null,
            feedback: '你坚持了塞尔的立场：语法永远不能构成语义。',
            philosophyExplanation: '塞尔的核心论证是：任何纯语法的系统都不可能仅仅通过其复杂性就产生语义。这就像说，无论你有多少钱，仅靠钱的数量不可能让它变成一种美德。如果这个论证正确，那么强人工智能（机器能真正理解）在原则上就是不可能的。但这个论证本身是否只是直觉的包装，而非严格的逻辑推导？',
            philosophySchools: ['生物自然主义'],
            routeTags: { bio_naturalism: 4, gap: 3, impossibility: 2 },
          },
        ],
      },
      {
        id: 'cr_s4',
        title: '反思人类理解',
        description: '你怀疑人类自己是否真的"理解"。让我们做一个测试：你能解释你如何"理解"红色吗？你能向一个从未见过颜色的盲人描述"红色的感觉"吗？',
        options: [
          {
            id: 'cr_s4a',
            text: '不能——主观体验无法被完全传达，它是第一人称的',
            nextStepId: null,
            feedback: '如果主观体验不可传达，那我们如何确认别人也有意识？',
            philosophyExplanation: '这就是"他心问题"：我只能直接体验自己的意识，对他人意识的存在只能通过类比推理——"他们和我行为相似，所以可能也有类似的内心体验"。但这个推理对AI也适用吗？如果一个AI表现得像有意识，我们是否也应该认为它有意识？还是说，只有生物体才可能有意识？',
            philosophySchools: ['现象学', '他心问题'],
            routeTags: { subjectivity: 4, other_minds: 3, first_person: 2 },
          },
          {
            id: 'cr_s4b',
            text: '也许"理解"不神秘——它只是一种能够灵活应对新情境的能力',
            nextStepId: null,
            feedback: '你消解了"理解"的神秘性，但这是真正的解释还是回避了问题？',
            philosophyExplanation: '维特根斯坦会说：理解不是一种内在的心理状态，而是一种能力——能够在新的情境中正确使用语言的能力。当你能恰当回应各种中文问题时，你就"理解"了中文。也许我们一直问错了问题：理解不是一个"内部发生了什么"的问题，而是一个"能做到什么"的问题。',
            philosophySchools: ['分析哲学', '实用主义'],
            routeTags: { ability: 4, externalism: 3, dissolution: 2 },
          },
        ],
      },
    ],
    endings: [
      {
        id: 'cr_ending_dualist',
        title: '意识守卫者',
        description: '你坚信意识是不可还原的，主观体验无法被物理过程所穷尽。',
        philosophySchools: ['现象学', '二元论'],
        routeTags: { qualia: 5, consciousness: 4, hard_problem: 3 },
        advice: '你对意识的坚持是深刻的。但请注意：如果意识真的完全独立于物理过程，我们如何解释大脑损伤对意识的明显影响？也许真正的挑战不是在物质和意识之间选择一边，而是找到一种能够同时尊重两者的框架。',
      },
      {
        id: 'cr_ending_functionalist',
        title: '功能主义者',
        description: '你相信心灵是功能模式，与载体无关——无论碳基还是硅基，只要功能等价就有心灵。',
        philosophySchools: ['功能主义', '分析哲学'],
        routeTags: { functionalism: 5, multiple_realizability: 3, information: 3 },
        advice: '功能主义为人工智能的可能性打开了大门，也为我们理解心灵提供了优雅的框架。但请思考：如果功能完全相同但内部"一片黑暗"的"哲学僵尸"是可能的，那么功能主义是否遗漏了最重要的东西——感受本身？',
      },
      {
        id: 'cr_ending_dissolver',
        title: '概念治疗师',
        description: '你认为"理解"和"意识"这些概念本身需要重新审视，很多困惑源于概念的误用。',
        philosophySchools: ['分析哲学', '实用主义'],
        routeTags: { dissolution: 5, clarity: 3, concept: 3 },
        advice: '概念治疗的方法令人清醒。但也要注意：维特根斯坦本人在生命的最后阶段也在思考那些"不可说"的东西。也许哲学不仅仅是治疗语言的病症，还有一种对超越语言之物的敬畏。',
      },
    ],
  },
  {
    id: 'plato_cave',
    title: '洞穴寓言',
    subtitle: 'Allegory of the Cave',
    description: '一群人从出生起就被锁在洞穴中，只能看到墙上的影子。如果你是第一个挣脱锁链看到阳光的人，你会回去告诉其他人吗？',
    icon: '🕯️',
    difficulty: 'beginner',
    relatedNodes: ['plato', 'aristotle', 'existentialism'],
    steps: [
      {
        id: 'pc_s1',
        title: '墙上的影子',
        description: '你一直生活在洞穴中，墙上投射的影子就是你认识的一切——人、树、房子。有一天，你的锁链松开了，你转过身看到了火光和道具。你意识到影子只是幻象。你会怎么做？',
        options: [
          {
            id: 'pc_s1a',
            text: '走向洞口——我必须知道真相，哪怕真相令人痛苦',
            nextStepId: 'pc_s2',
            feedback: '你选择了真理，即使它可能刺痛你的眼睛。',
            philosophyExplanation: '柏拉图会说，这就是哲学家的使命——从影像世界走向理念世界。但这趟旅程是痛苦的：走出洞穴的过程就像从黑暗到光明，眼睛会感到刺痛。真理不是舒适的，追寻真理需要勇气。',
            philosophySchools: ['柏拉图主义'],
            routeTags: { truth_seeking: 4, courage: 3, idealism: 2 },
          },
          {
            id: 'pc_s1b',
            text: '留在洞里——影子虽然不真实，但至少让我感到安全',
            nextStepId: 'pc_s3',
            feedback: '你选择了舒适而非真理。但这真的是一个安全的选择吗？',
            philosophyExplanation: '这呼应了诺齐克的"体验机"思想实验：如果一台机器可以给你完美的快乐体验，你愿意接入吗？大多数人拒绝——我们不只是想要快乐的感受，我们还想要"真实地活着"。但"真实地活着"的代价有时是巨大的。',
            philosophySchools: ['实用主义', '存在主义'],
            routeTags: { comfort: 3, safety: 2, pragmatism: 2 },
          },
        ],
      },
      {
        id: 'pc_s2',
        title: '阳光下的世界',
        description: '你走出了洞穴，看到了真正的太阳、真正的树和真正的人。真相令人震撼——但当你回到洞穴告诉其他人时，他们嘲笑你，说你出去一趟眼睛反而坏了。他们甚至威胁要杀掉任何试图解开锁链的人。',
        options: [
          {
            id: 'pc_s2a',
            text: '继续告诉他们真相——这是我看到的，他们有权知道',
            nextStepId: null,
            feedback: '你选择了苏格拉底的道路——即使以生命为代价。',
            philosophyExplanation: '苏格拉底饮下毒酒，正是为真理作证的极致。柏拉图认为，真正的哲学家必须回到洞穴中，帮助他人解放——即使他们不理解、甚至敌视你。但问题是：你有权替别人决定什么是"真实"吗？如果你错了呢？',
            philosophySchools: ['柏拉图主义', '道义论'],
            routeTags: { truth_seeking: 5, sacrifice: 3, enlightenment: 2 },
          },
          {
            id: 'pc_s2b',
            text: '也许不该强迫他们——每个人都有选择自己现实的自由',
            nextStepId: null,
            feedback: '你尊重了他人的自主性，但这是尊重还是逃避责任？',
            philosophyExplanation: '密尔的"伤害原则"会说：只要不伤害他人，人们有权选择自己的信念。但如果他们被锁链束缚，从未真正"选择"过呢？存在主义会说，你必须尊重他人的自由——即使他们的自由选择是留在洞穴中。但萨特也承认，这种尊重有时是痛苦的。',
            philosophySchools: ['存在主义', '自由主义'],
            routeTags: { freedom: 4, autonomy: 3, tolerance: 2 },
          },
        ],
      },
      {
        id: 'pc_s3',
        title: '影子的安慰',
        description: '你选择留在洞穴中。但问题来了：当你知道了影子只是影子，你还能像以前一样安心地看它们吗？',
        options: [
          {
            id: 'pc_s3a',
            text: '不能——一旦你知道了真相，就无法假装不知道',
            nextStepId: null,
            feedback: '无知一旦失去，就再也回不去了。这是诅咒还是祝福？',
            philosophyExplanation: '这就是"伊甸园困境"：吃了知识树上的果实后，人类就永远失去了纯真。存在主义称之为"焦虑"——当你意识到选择的自由和责任时，你就再也无法回到无意识的安逸中。也许真正的困境不是真理与幻象的选择，而是：一旦你开始了追问，就不可能停下来。',
            philosophySchools: ['存在主义'],
            routeTags: { anxiety: 4, knowledge: 3, irreversibility: 2 },
          },
          {
            id: 'pc_s3b',
            text: '可以——接受影子就是我的生活现实，不需要追问"背后"',
            nextStepId: null,
            feedback: '你选择了"形而上学的克制"——但这是什么？是智慧还是自欺？',
            philosophyExplanation: '维特根斯坦说："凡是不可说的，我们必须保持沉默。"也许追问"影子背后是什么"本身就是一种越界——我们的认知能力可能就是有限的，有些问题不仅无法回答，甚至不该被提出。但批评者会说：这个忠告本身不也是对不可说之物的言说吗？',
            philosophySchools: ['分析哲学', '实用主义'],
            routeTags: { restraint: 4, acceptance: 3, limits: 2 },
          },
        ],
      },
    ],
    endings: [
      {
        id: 'pc_ending_truth_seeker',
        title: '真理追寻者',
        description: '你始终选择面对真相，即使它令人痛苦或危险。你相信真理的价值高于舒适和安全。',
        philosophySchools: ['柏拉图主义', '理性主义'],
        routeTags: { truth_seeking: 5, courage: 4, idealism: 3 },
        advice: '追寻真理的勇气令人敬佩。但请记住柏拉图的警告：回到洞穴的人可能不被理解，甚至被杀害。在现实中，"真理"可能不像数学那样确定——你看到的"阳光"可能是另一层幻象。保持追寻的勇气，也保持对自身的怀疑。',
      },
      {
        id: 'pc_ending_freedom_chooser',
        title: '自由选择者',
        description: '你重视个体的自由选择，无论是追求真理还是接受幻象，都应是个人的自主决定。',
        philosophySchools: ['存在主义', '自由主义'],
        routeTags: { freedom: 5, autonomy: 4, choice: 3 },
        advice: '对自由的尊重是深刻的。但请思考：洞穴中的人从未真正"选择"过留在洞穴——他们是被锁住的。尊重自由的前提是人们真正拥有自由。真正的解放不是替别人做选择，而是帮助他们获得选择的能力。',
      },
      {
        id: 'pc_ending_pragmatist',
        title: '现实主义者',
        description: '你关注具体的生活现实，对超越性的真理保持审慎。你认为哲学应该服务于生活，而非远离生活。',
        philosophySchools: ['实用主义', '亚里士多德主义'],
        routeTags: { pragmatism: 5, practice: 4, reality: 3 },
        advice: '对现实的关注是务实的智慧。但也要注意：现实本身可能是需要被改变的。每一个社会进步都始于有人质疑"这就是现实"。也许真正的现实主义不是接受现状，而是在认清现实的同时保留改变它的勇气。',
      },
    ],
  },
  {
    id: 'experience_machine',
    title: '体验机器',
    subtitle: 'Experience Machine',
    description: '如果有一台机器能给你完美的快乐体验——写作伟大的小说、交亲密的朋友、攀登高峰——但这一切都是模拟的。你会接入吗？',
    icon: '🔌',
    difficulty: 'beginner',
    relatedNodes: ['utilitarianism', 'existentialism', 'kant'],
    steps: [
      {
        id: 'em_s1',
        title: '完美的快乐',
        description: '神经科学家发明了一台"体验机器"：接入后，你可以体验任何你想要的生活——成为伟大的作家、赢得奥运会金牌、拥有完美的爱情。所有体验都和真实的一模一样，你不会知道自己在机器里。你愿意接入吗？',
        options: [
          {
            id: 'em_s1a',
            text: '不愿意——真实比快乐更重要',
            nextStepId: 'em_s2',
            feedback: '你拒绝了完美的快乐，选择了"真实"。但为什么呢？',
            philosophyExplanation: '诺齐克正是用这个思想实验来反驳功利主义：如果快乐是唯一重要的事情，那么每个人都应该接入体验机器。但大多数人的直觉是拒绝——这意味着我们重视的不仅仅是快乐的感受，还有"真实地活着"。但什么是"真实"？',
            philosophySchools: ['道义论', '存在主义'],
            routeTags: { authenticity: 4, reality: 3, refusal: 2 },
          },
          {
            id: 'em_s1b',
            text: '愿意——如果体验完全一样，"真实"和"模拟"的区别有什么关系？',
            nextStepId: 'em_s3',
            feedback: '你选择了快乐，质疑了"真实"的特殊价值。但这真的那么简单吗？',
            philosophyExplanation: '功利主义者在逻辑上必须接受：如果快乐是唯一的价值，那么体验机器就是最优选择。但这个结论让大多数人不安。也许不安本身就是重要的——它揭示了我们直觉中快乐之外的价值维度。或者，也许我们的"不安"只是一种进化残留，就像怕蛇一样，没有理性基础？',
            philosophySchools: ['功利主义', '快乐主义'],
            routeTags: { hedonism: 4, pleasure: 3, consistency: 2 },
          },
        ],
      },
      {
        id: 'em_s2',
        title: '真实的重量',
        description: '你选择了真实。但让我们追问：什么是"真实"让你觉得比快乐更重要？是"事情真的在发生"？是"你在真正地行动"？还是别的什么？',
        options: [
          {
            id: 'em_s2a',
            text: '我想要真正地"做"事情，而不只是"感觉"自己在做',
            nextStepId: null,
            feedback: '你认为行动本身有价值，不仅是行动的体验。',
            philosophyExplanation: '这是亚里士多德和存在主义共同关心的问题：人的本质在于行动和实践，而非被动的感受。存在主义会说，"存在"就是"去存在"——存在是一种动态的、自我创造的活动，而不是一种状态。在体验机器中，你什么也没做，你只是在"感受"自己做了——这不是真正的存在。',
            philosophySchools: ['存在主义', '亚里士多德主义'],
            routeTags: { action: 4, authenticity: 3, existence: 2 },
          },
          {
            id: 'em_s2b',
            text: '我想要与现实建立真实的联系——与他人、与世界',
            nextStepId: null,
            feedback: '你渴望的是关系——真实的关系比完美的模拟更有价值。',
            philosophyExplanation: '列维纳斯会赞赏你：伦理始于"他者的面容"——对另一个人的真实回应。在体验机器中，没有真正的"他者"，只有模拟。布伯的"我-你"关系也强调，真正的关系是两个自由主体之间的相遇，而非主体与客体的使用关系。但问题来了：如果你的朋友也接入了体验机器，他们在模拟中对你"好"，和在现实中对你"坏"，哪个更值得？',
            philosophySchools: ['伦理学', '现象学'],
            routeTags: { relation: 4, otherness: 3, contact: 2 },
          },
        ],
      },
      {
        id: 'em_s3',
        title: '快乐的极限',
        description: '你选择了快乐。但让我们推一步：如果有一天机器出了故障，你短暂地清醒过来，发现自己漂浮在暗无天日的容器中，身上插满管子——你还能坚持你的选择吗？',
        options: [
          {
            id: 'em_s3a',
            text: '坚持——清醒的瞬间只是技术故障，不改变快乐的本质',
            nextStepId: null,
            feedback: '你在逻辑上保持了功利主义的一致性。但这份一致性的代价是什么？',
            philosophyExplanation: '如果坚持功利主义，你就必须承认：即使知道自己一生都是虚假的，只要快乐是真实的，那就没有问题。这是一种极端的立场，但它在逻辑上是自洽的。问题是：这种自洽是否只是理论的完美，而完全脱离了人的实际处境？密尔说过："做不满足的苏格拉底胜于做满足的猪。"你确定你选的不是后者吗？',
            philosophySchools: ['功利主义'],
            routeTags: { hedonism: 5, consistency: 3, purity: 2 },
          },
          {
            id: 'em_s3b',
            text: '也许不该接入了——清醒的恐惧让我意识到，我需要的不只是快乐',
            nextStepId: null,
            feedback: '你从功利主义的逻辑中走了出来。这个转折意味着什么？',
            philosophyExplanation: '也许这正是诺齐克想要揭示的：快乐不是唯一的价值。我们的直觉在极端情境中被唤醒——我们不仅想要感觉好，还想要"真实地活着"。但这种直觉是否可靠？当你在真实世界中痛苦挣扎时，那个完美的体验机器是否又变得诱人了？也许人性就是在这种矛盾中存在的。',
            philosophySchools: ['存在主义', '道义论'],
            routeTags: { awakening: 4, authenticity: 3, truth: 2 },
          },
        ],
      },
    ],
    endings: [
      {
        id: 'em_ending_authentic',
        title: '本真存在者',
        description: '你始终坚持真实比快乐更重要，即使代价是痛苦和不确定。',
        philosophySchools: ['存在主义', '道义论'],
        routeTags: { authenticity: 5, truth: 4, courage: 3 },
        advice: '对真实的坚守是存在主义的核心精神。但请思考：你对"真实"的执着是否也可能变成一种执念？如果真实的痛苦让人无法思考和行动，那么一定程度的"自我安慰"是否也是合理的？真正的勇气也许不是从不逃避，而是在需要时能够面对。',
      },
      {
        id: 'em_ending_hedonist',
        title: '快乐主义者',
        description: '你坚持快乐是最根本的价值，质疑"真实"相对于"幸福"的优越地位。',
        philosophySchools: ['功利主义', '快乐主义'],
        routeTags: { hedonism: 5, pleasure: 4, consistency: 3 },
        advice: '功利主义的逻辑力量是强大的，它迫使我们直面自己对"真实"的偏执。但请注意：密尔本人区分了快乐的"质量"——有些快乐比其他快乐更值得追求。也许真正的快乐不是被动的感受，而是主动地、真实地去生活和创造。',
      },
      {
        id: 'em_ending_complex',
        title: '辩证思考者',
        description: '你的选择展现了内在的矛盾——你同时渴望快乐和真实，在两者之间不断摇摆。',
        philosophySchools: ['亚里士多德主义', '批判哲学'],
        routeTags: { dialectic: 5, balance: 4, complexity: 3 },
        advice: '你的矛盾不是弱点，而是人性的真实写照。亚里士多德说的"中道"不是折中，而是在具体情境中找到最恰当的平衡。也许真正的智慧不在于选择真实或快乐，而在于理解两者如何在具体生活中相互交织。',
      },
    ],
  },
];

export const getExperimentById = (id: string) =>
  thoughtExperiments.find((e) => e.id === id);

export const getExperimentStep = (experimentId: string, stepId: string) => {
  const experiment = getExperimentById(experimentId);
  return experiment?.steps.find((s) => s.id === stepId);
};

export const getFirstStep = (experimentId: string) => {
  const experiment = getExperimentById(experimentId);
  return experiment?.steps[0] ?? null;
};

export const getRecommendedExperiments = (
  completedIds: string[],
  routeTags: Record<string, number>,
): ThoughtExperimentData[] => {
  const available = thoughtExperiments.filter(
    (e) => !completedIds.includes(e.id),
  );

  if (available.length === 0) return [];

  const scored = available.map((exp) => {
    let score = 0;

    const topUserTags = Object.entries(routeTags)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag]) => tag);

    exp.steps.forEach((step) => {
      step.options.forEach((opt) => {
        Object.keys(opt.routeTags).forEach((tag) => {
          if (topUserTags.includes(tag)) {
            score += routeTags[tag] ?? 0;
          }
        });
      });
    });

    if (exp.difficulty === 'beginner') score *= 1.2;
    if (exp.difficulty === 'advanced') score *= 0.8;

    return { experiment: exp, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.experiment);
};

export const resolveExperimentEnding = (
  experimentId: string,
  routeTags: Record<string, number>,
): string => {
  const experiment = getExperimentById(experimentId);
  if (!experiment || experiment.endings.length === 0) return experiment?.endings[0]?.id ?? '';

  const topUserTags = Object.entries(routeTags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag);

  const scored = experiment.endings.map((ending) => {
    let score = 0;
    Object.entries(ending.routeTags).forEach(([tag, val]) => {
      if (topUserTags.includes(tag)) {
        score += val;
      }
    });
    return { ending, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0].ending.id;
};
