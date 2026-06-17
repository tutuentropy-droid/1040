import type { Question } from '../types';

// 8个核心哲学问题，通过 nextQuestionId 形成分支探索流程

export const questions: Question[] = [
  // 问题1：自由 vs 安全（入口问题）
  {
    id: 'q1',
    title: '自由与安全，你更看重哪一个？',
    description:
      '假如你必须在个人自由与集体安全之间做出选择，你会倾向于哪一边？这决定了你思想探索的起点。',
    options: [
      {
        id: 'q1a',
        text: '自由高于一切，哪怕冒着风险也要保持自主选择的权利',
        unlockNodes: ['existentialism', 'nietzsche'],
        routeTags: { freedom: 3, individual: 2, will: 2 },
        nextQuestionId: 'q5',
        feedback:
          '"人被判定为自由"——萨特的这句话或许会让你共鸣。自由不是一种选择，而是人的宿命。但自由意味着你要为自己的每一个选择承担全部责任。这或许沉重，但正是这份沉重，才是人的尊严所在。',
      },
      {
        id: 'q1b',
        text: '安全更重要，稳定的秩序是幸福生活的基础',
        unlockNodes: ['stoicism', 'utilitarianism', 'marxism'],
        routeTags: { collective: 3, security: 2, order: 2 },
        nextQuestionId: 'q4',
        feedback:
          '斯多葛学派告诉我们，幸福不在于掌控能掌控的，接受不能掌控的。功利主义则追求最大多数人的最大幸福，安全和秩序往往是这一目标的前提。但也要警惕：安全的边界在哪里？',
      },
      {
        id: 'q1c',
        text: '两者都重要，寻找自由与安全的动态平衡才是智慧',
        unlockNodes: ['aristotle', 'kant'],
        routeTags: { balance: 3, balance_moderation: 2, rational: 2 },
        nextQuestionId: 'q2',
        feedback:
          '亚里士多德的"中道"思想或许正适合你——美德在于两个极端之间的适中状态。但请记住，平衡不是简单的折中，而是在具体情境中做出明智的判断。这需要的，正是康德所说的"判断力"。',
      },
    ],
  },

  // 问题2：真理的客观性
  {
    id: 'q2',
    title: '真理是客观存在的，还是人的主观建构？',
    description:
      '"2+2=4"、"地球是圆的"——这些我们称之为真理的东西，是独立于人的客观存在，还是人类共同体的共同约定？',
    options: [
      {
        id: 'q2a',
        text: '真理是客观的，世界有其固有的规律，等待人去发现',
        unlockNodes: ['plato', 'descartes', 'spinoza'],
        routeTags: { rationalism: 3, objectivism: 3, idealism: 2 },
        nextQuestionId: 'q3',
        feedback:
          '柏拉图的理念论认为，真理永恒存在于理念世界，我们所感官世界只是不完美的摹本。笛卡尔则通过"我思"寻找那个绝对确定的阿基米德点。但是，当你说"真理客观存在"时，这个断言本身是否也是一种信念？',
      },
      {
        id: 'q2b',
        text: '没有绝对的真理，所有真理都有其历史和文化的局限',
        unlockNodes: ['nietzsche', 'pragmatism', 'marxism'],
        routeTags: { perspectivism: 3, historicism: 2, constructivism: 2 },
        nextQuestionId: 'q6',
        feedback:
          '尼采说："没有事实，只有解释。"实用主义告诉我们，真理是那些在实践中有效的东西。马克思则揭示了真理背后的权力关系。但如果一切都是视角，那这句话本身不也是一种视角吗？',
      },
      {
        id: 'q2c',
        text: '真理是主观与客观的互动，是人类认识能力与世界的契合',
        unlockNodes: ['kant', 'phenomenology'],
        routeTags: { critical: 3, constructivism: 2, balance: 2 },
        nextQuestionId: 'q7',
        feedback:
          '康德的"哥白尼式革命"正在于此：不是知识符合对象，而是对象符合我们的认识能力。现象学则邀请我们"回到事情本身"，在意识的意向性活动中，主客体原本就是一体的。',
      },
      {
        id: 'q2d',
        text: '这个问题本身可能没有意义——用语言讨论真理本身就是问题',
        unlockNodes: ['analytic_philosophy', 'hume'],
        routeTags: { linguistic: 3, skepticism: 2, analysis: 2 },
        nextQuestionId: 'q8',
        feedback:
          '分析哲学认为，许多传统哲学问题源于语言的误用。维特根斯坦说："凡是可说的，都能说清楚；凡是不可说的，我们应当沉默。"也许，真理的问题本身就是语言的陷阱？',
      },
    ],
  },

  // 问题3：幸福 vs 正义
  {
    id: 'q3',
    title: '幸福与正义冲突时，你站在哪一边？',
    description:
      '假设一个行为能让大多数人幸福，但对少数人不公；或者坚守正义可能会让更多人陷入痛苦。你会如何选择？',
    options: [
      {
        id: 'q3a',
        text: '最大多数人的最大幸福是首要目标',
        unlockNodes: ['utilitarianism'],
        routeTags: { utilitarian: 3, consequence: 3, happiness: 2 },
        nextQuestionId: 'q6',
        feedback:
          '边沁和密尔的功利主义正是你的同路人。但请反思：为了多数人的幸福而牺牲少数人，这本身正义吗？如果那个被牺牲的是你或你的亲人，答案还一样吗？',
      },
      {
        id: 'q3b',
        text: '正义是绝对的原则，无论后果如何都不能违背',
        unlockNodes: ['kant'],
        routeTags: { deontology: 3, principle: 3, duty: 2 },
        nextQuestionId: 'q5',
        feedback:
          '康德的"绝对命令"：永远把人当作目的，而不是手段。正义的原则不能因为任何功利计算而妥协。但请问：当坚守正义的代价是无数人的生命时，你的答案还会如此坚定吗？',
      },
      {
        id: 'q3c',
        text: '我需要知道具体情境——抽象的问题无法给出抽象的答案',
        unlockNodes: ['aristotle', 'pragmatism'],
        routeTags: { practical: 3, wisdom: 2, situation: 2 },
        nextQuestionId: 'q7',
        feedback:
          '亚里士多德的"实践智慧"（phronesis）正是这种思路：道德判断不能被化约为抽象规则，它需要在具体情境中运用明智的权衡。实用主义同样会问：这个区分在实践中会带来什么不同？',
      },
    ],
  },

  // 问题4：个体 vs 集体
  {
    id: 'q4',
    title: '个人利益与集体利益，哪个更根本？',
    description:
      '社会是个人的集合，还是个人只是社会整体的一个组成部分？这决定了你对"好社会"的想象。',
    options: [
      {
        id: 'q4a',
        text: '个人是根本，社会的目的是保障每个个体的权利',
        unlockNodes: ['existentialism', 'locke', 'nietzsche'],
        routeTags: { individualism: 3, liberty: 3, rights: 2 },
        nextQuestionId: 'q8',
        feedback:
          '洛克说，个人拥有生命、自由、财产的自然权利，政府的目的就是保护这些权利。尼采警告，不要让"群体本能"扼杀了"超人"的可能性。但是，个人的边界在哪里？',
      },
      {
        id: 'q4b',
        text: '集体是根本，个人只有在整体中才能实现真正的价值',
        unlockNodes: ['marxism', 'hegel', 'aristotle'],
        routeTags: { collectivism: 3, community: 3, whole: 2 },
        nextQuestionId: 'q7',
        feedback:
          '亚里士多德说"人是政治动物"，人只有在城邦中才能实现其本质。黑格尔认为个人是绝对精神在历史中的体现。马克思则主张"每个人的自由发展是一切人的自由发展的条件"——你的选择暗示了，你可能站在历史的哪一边？',
      },
      {
        id: 'q4c',
        text: '两者相互依存，没有孰先孰后，需要辩证看待',
        unlockNodes: ['kant', 'stoicism'],
        routeTags: { dialectic: 3, balance: 2, relation: 2 },
        nextQuestionId: 'q3',
        feedback:
          '康德的"目的王国"中，每个人既是立法者也是守法者。斯多葛学派认为我们每个人既是自己的公民，也是宇宙城邦的公民。也许，答案不在于非此即彼，而在于如何让两者相互成就？',
      },
    ],
  },

  // 问题5：理性 vs 经验
  {
    id: 'q5',
    title: '知识的来源是什么？理性还是经验？',
    description:
      '当理性推理与感官经验发生冲突时，你更愿意相信哪一个？这是近代哲学最核心的分歧之一。',
    options: [
      {
        id: 'q5a',
        text: '理性是知识的真正来源，逻辑和数学是真理的典范',
        unlockNodes: ['descartes', 'spinoza', 'leibniz'],
        routeTags: { rationalism: 4, logic: 2, apriori: 3 },
        nextQuestionId: 'q8',
        feedback:
          '你属于理性主义的阵营：笛卡尔通过"我思"、斯宾诺莎用几何学方法、莱布尼茨的"推理真理"都在召唤你。但请想一想：如果一切都靠理性，那新的知识从何而来？理性本身不也是在经验中成长的吗？',
      },
      {
        id: 'q5b',
        text: '一切知识都来源于经验，人心初时只是一张白纸',
        unlockNodes: ['locke', 'berkeley', 'hume'],
        routeTags: { empiricism: 4, experience: 3, sensation: 2 },
        nextQuestionId: 'q6',
        feedback:
          '你是洛克"白板说"的继承者。从经验出发，贝克莱走向"存在就是被感知"，休谟走向彻底的怀疑论。但请反思：如果一切都来自经验，那"因果关系"本身你观察到了吗？逻辑规则本身是经验的吗？',
      },
      {
        id: 'q5c',
        text: '两者共同作用，没有经验的理性是空的，没有理性的经验是盲的',
        unlockNodes: ['kant'],
        routeTags: { critical: 4, synthesis: 3, balance: 2 },
        nextQuestionId: 'q7',
        feedback:
          '康德的名言正是你的选择："没有内容的思想是空的，没有概念的直观是盲的。"你站在了近代哲学两大传统的合题之上。但这种"结合"本身如何可能？这或许是康德留给后世最深的谜题。',
      },
    ],
  },

  // 问题6：人生的意义
  {
    id: 'q6',
    title: '人生有什么意义？',
    description:
      '这或许是人类永恒的追问。你对这个问题的回答，将决定你哲学地图上的最终归宿。',
    options: [
      {
        id: 'q6a',
        text: '人生本没有预设的意义，意义要靠自己去创造',
        unlockNodes: ['existentialism', 'nietzsche'],
        routeTags: { existential: 4, creation: 3, freedom: 2 },
        nextQuestionId: null,
        feedback:
          '存在先于本质——你选择了最勇敢的答案。没有上帝为你写好剧本，你就是自己的作者。尼采说："成为你自己！"但这条没有路标、没有扶手的道路，你有勇气走到底吗？——这或许就是，查拉图斯特拉下山的理由。',
      },
      {
        id: 'q6b',
        text: '顺应自然，理解宇宙的秩序与必然性，获得内心的自由',
        unlockNodes: ['stoicism', 'spinoza'],
        routeTags: { harmony: 3, nature: 3, necessity: 2 },
        nextQuestionId: null,
        feedback:
          '斯宾诺莎说："自由不是随心所欲，而是对必然性的认识。"斯多葛学派也教导我们：接受命运，专注可控之事。当你理解了一切为何如此这般地发生，你就不再受其奴役——这不是消极的顺从，而是最高的自由。',
      },
      {
        id: 'q6c',
        text: '通过认识真理、观照永恒的智慧与美，这是灵魂的使命',
        unlockNodes: ['plato', 'aristotle'],
        routeTags: { wisdom: 3, truth: 3, contemplation: 2 },
        nextQuestionId: null,
        feedback:
          '亚里士多德认为，"思辨的生活是最幸福的生活"——这是属于神的生活。柏拉图的洞穴中，那个走出洞穴、看见太阳的人，其最终的归宿是对善的理念的凝视。你选择了一条古老而高贵的道路——哲学，就是"练习死亡"。',
      },
      {
        id: 'q6d',
        text: '人生的意义在对他人和社会的奉献之中',
        unlockNodes: ['marxism', 'utilitarianism', 'kant'],
        routeTags: { altruism: 3, contribution: 3, morality: 2 },
        nextQuestionId: null,
        feedback:
          '康德说："有两种东西，我们愈时常、愈反复地加以思索，它们就愈使心灵充满始终新鲜、不断增长的景仰和敬畏：在我之上的星空和居我心中的道德法则。"马克思则召唤："哲学家们只是用不同的方式解释世界，而问题在于改变世界。"——这是你将目光从天上转向人间的一步。',
      },
    ],
  },

  // 问题7：道德的来源
  {
    id: 'q7',
    title: '道德的基础是什么？',
    description:
      '是什么让一个行为成为"善"或"恶"？是神的旨意？是社会契约？是人的情感？还是别的什么？',
    options: [
      {
        id: 'q7a',
        text: '道德源于人心中的理性法则，是对义务的敬重',
        unlockNodes: ['kant'],
        routeTags: { deontology: 4, reason: 3, duty: 3 },
        nextQuestionId: 'q6',
        feedback:
          '康德的"绝对命令"在你心中回响：道德不是达到任何目的的手段，它自身就是目的。你心中回荡的不是外部的命令，而是你自己作为理性存在者给自己颁布的法则——自律即自由。',
      },
      {
        id: 'q7b',
        text: '道德源于对快乐和痛苦的感受，源于同情心',
        unlockNodes: ['hume', 'utilitarianism'],
        routeTags: { sentiment: 3, emotion: 3, happiness: 2 },
        nextQuestionId: 'q6',
        feedback:
          '休谟说："理性是激情的奴隶。"道德的根源不在于冰冷的理性，而在于我们心中的"同情"。功利主义同样从苦乐感受出发。但请问：如果道德只是感受，那当"同情"缺席时，恶就没有"错"了吗？',
      },
      {
        id: 'q7c',
        text: '道德是强者发明的、弱者用来约束强者的工具',
        unlockNodes: ['nietzsche', 'marxism'],
        routeTags: { critique: 3, power: 3, suspicion: 2 },
        nextQuestionId: 'q6',
        feedback:
          '尼采的《道德的谱系》揭示了"善与恶"背后的权力斗争——"主人道德"与"奴隶道德"的翻转。马克思则揭露了意识形态背后的阶级利益。你戴上了"怀疑的解释学"的眼镜——但看穿一切之后，你的脚站在哪里？',
      },
      {
        id: 'q7d',
        text: '道德来自习惯与传统，是社群生活的产物',
        unlockNodes: ['aristotle', 'pragmatism'],
        routeTags: { tradition: 3, community: 3, custom: 2 },
        nextQuestionId: 'q6',
        feedback:
          '亚里士多德认为，美德是通过习惯养成的，我们做正义的事才成为正义的人。实用主义会问：这个道德规则在实践中有效吗？——但你有没有想过，当传统本身需要被变革的时候呢？',
      },
    ],
  },

  // 问题8：存在 vs 本质
  {
    id: 'q8',
    title: '是"存在先于本质"，还是"本质先于存在"？',
    description:
      '人是先存在着，然后通过选择定义自己？还是说，人有一个预先的本质，存在只是去实现那个本质？',
    options: [
      {
        id: 'q8a',
        text: '存在先于本质——我先存在，然后我创造自己的本质',
        unlockNodes: ['existentialism', 'nietzsche'],
        routeTags: { existential: 4, freedom: 4, choice: 3 },
        nextQuestionId: 'q6',
        feedback:
          '这是萨特最著名的命题。没有上帝，没有人性，没有预定的命运——你被抛弃了，孤零零地自由着。人不过是自己设计的蓝图。如果你感到焦虑，那正是自由的眩晕——但这也是你作为人的尊严。',
      },
      {
        id: 'q8b',
        text: '本质先于存在——万物都有其本性，人要去实现自己的目的',
        unlockNodes: ['plato', 'aristotle', 'leibniz'],
        routeTags: { essentialism: 4, teleology: 3, purpose: 2 },
        nextQuestionId: 'q6',
        feedback:
          '柏拉图认为，所有事物都有其理念/本质，尘世的存在只是对理念的摹仿。亚里士多德也认为，万物都有其"目的因"，橡子的目的就是成为橡树。莱布尼茨说，这个世界是"所有可能世界中最好的"——你相信有一个属于你的"本质在等你去成为。',
      },
      {
        id: 'q8c',
        text: '这是一个伪问题，语言的误用产生了这种区分',
        unlockNodes: ['analytic_philosophy', 'hume'],
        routeTags: { analysis: 4, linguistic: 3, antimetaphysics: 2 },
        nextQuestionId: 'q6',
        feedback:
          '分析哲学会让你先澄清："存在"是什么意思？"本质"又是什么意思？也许这个问题本身就像"7是黄色的吗？"一样——语法正确，但毫无意义。当哲学治疗好了，问题也就消失了。',
      },
      {
        id: 'q8d',
        text: '让我们先"悬置"这个问题，回到意识的事情本身',
        unlockNodes: ['phenomenology', 'kant'],
        routeTags: { phenomenology: 4, epoché: 3, description: 2 },
        nextQuestionId: 'q6',
        feedback:
          '现象学邀请你：将关于"存在"和"本质"的所有形而上学判断先"放在括号里"，悬置起来，然后去描述：意识是如何呈现的。也许，在你描述的过程中，答案自己会显现。',
      },
    ],
  },
];

// 根据 ID 获取问题
export const getQuestionById = (id: string) =>
  questions.find((q) => q.id === id);

// 获取第一个问题
export const getFirstQuestion = () => questions[0];
