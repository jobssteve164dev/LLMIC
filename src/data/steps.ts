export type EvidenceLevel = "A" | "B" | "C";

export type SceneKind =
  | "brief"
  | "logic"
  | "mask"
  | "quartz"
  | "ingot"
  | "wafer"
  | "oxidation"
  | "gate"
  | "contact"
  | "poly"
  | "doping"
  | "oxide"
  | "metal"
  | "passivation"
  | "probe"
  | "dicing"
  | "package"
  | "calculator";

export interface ProductionStep {
  id: string;
  number: string;
  phase: string;
  title: string;
  takeaway: string;
  action: string;
  detail: string;
  scale: string;
  evidence: EvidenceLevel;
  sourceIds: string[];
  scene: SceneKind;
  bridge?: {
    label: string;
    title: string;
    body: string;
  };
}

export interface Source {
  id: string;
  institution: string;
  title: string;
  url: string;
}

export const sources: Source[] = [
  {
    id: "intel-history",
    institution: "Intel",
    title: "The Intel 4004 — Announcing a New Era of Integrated Electronics",
    url: "https://www.intel.com/content/www/us/en/history/virtual-vault/articles/the-intel-4004.html",
  },
  {
    id: "intel-data",
    institution: "Intel",
    title: "Intel 4004 50th anniversary specification infographic",
    url: "https://download.intel.com/newsroom/2021/data-center/4004-infographic.pdf",
  },
  {
    id: "datasheet",
    institution: "Intel / Bitsavers",
    title: "MCS-4 Micro Computer Set data sheet, November 1971",
    url: "https://www.bitsavers.org/components/intel/MCS4/MCS4_Data_Sheet_Nov71.pdf",
  },
  {
    id: "chm-silicon",
    institution: "Computer History Museum",
    title: "Silicon Gate Technology Developed for ICs",
    url: "https://www.computerhistory.org/siliconengine/silicon-gate-technology-developed-for-ics/",
  },
  {
    id: "chm-4004",
    institution: "Computer History Museum",
    title: "Microprocessor Integrates CPU Function onto a Single Chip",
    url: "https://www.computerhistory.org/siliconengine/microprocessor-integrates-cpu-function-onto-a-single-chip/",
  },
  {
    id: "oral-history",
    institution: "Computer History Museum",
    title: "Oral History Panel on the Development of the Intel 4004",
    url: "https://archive.computerhistory.org/resources/text/Oral_History/Intel_4004_2/102658187.05.01.acc.pdf",
  },
  {
    id: "faggin",
    institution: "Federico Faggin",
    title: "The MOS Silicon Gate Technology and the First Microprocessors",
    url: "http://www.intel4004.com/The_MOS_Silicon_Gate_Technology_and_the_First_Microprocessors.pdf",
  },
  {
    id: "sumco",
    institution: "SUMCO",
    title: "Monocrystalline silicon production process",
    url: "https://www.sumcosi.com/english/products/process/",
  },
  {
    id: "sia-front",
    institution: "Semiconductor Industry Association",
    title: "Stage 3: Front-end Manufacturing",
    url: "https://www.semiconductors.org/semiconductors-101/how-are-semiconductors-made/stage-3-front-end-manufacturing/",
  },
  {
    id: "sia-back",
    institution: "Semiconductor Industry Association",
    title: "Stage 4: Back-end Manufacturing",
    url: "https://www.semiconductors.org/semiconductors-101/how-are-semiconductors-made/stage-4-back-end-manufacturing/",
  },
  {
    id: "4004-archive",
    institution: "Intel 4004 35th Anniversary Project",
    title: "Complete Artwork, Schematics, and Simulator for Intel MCS-4",
    url: "https://www.4004.com/mcs4-masks-schematics-sim.html",
  },
  {
    id: "intel-ipnc",
    institution: "Intel / OpenCores archive",
    title: "Intellectual property release for non-commercial use",
    url: "https://opencores.org/websvn/filedetails?path=%2Fmcs-4%2Ftrunk%2Fdoc%2FIntel_IPNC_License.pdf&repname=mcs-4",
  },
];

export const steps: ProductionStep[] = [
  {
    id: "brief",
    number: "01",
    phase: "从需求开始",
    title: "把计算器装进程序",
    takeaway: "与其制造 12 颗固定功能芯片，不如让一颗 CPU 按程序工作。",
    action: "旋转模型，观察 12 个模块如何收拢为 MCS-4。",
    detail: "1969 年，Busicom 希望 Intel 为打印计算器开发一组专用芯片。团队最终把方案压缩成四颗协作芯片：ROM、RAM、移位寄存器和可编程的 4004 CPU。",
    scale: "系统级",
    evidence: "A",
    sourceIds: ["intel-history", "oral-history"],
    scene: "brief",
  },
  {
    id: "logic",
    number: "02",
    phase: "从需求开始",
    title: "把动作变成逻辑",
    takeaway: "加法、记忆和控制，先被拆成可以连接的逻辑单元。",
    action: "拖动画面，寻找发光的四位加法路径。",
    detail: "工程师先定义寄存器、四位算术单元、程序计数器和控制器，再把逻辑门变成 PMOS 晶体管电路。4004 最终集成约 2,300 个晶体管。",
    scale: "逻辑单元",
    evidence: "A",
    sourceIds: ["intel-data", "datasheet"],
    scene: "logic",
  },
  {
    id: "mask",
    number: "03",
    phase: "从需求开始",
    title: "把电路画成六张地图",
    takeaway: "每一层都使用同一组版图坐标，叠合后才组成一颗完整的 4004。",
    action: "切换叠合与分层，再逐一开关六类图形核对坐标。",
    detail: "场景按 1968 × 2706 像素校正版图对齐呈现扩散、埋层接触、多晶硅、接触孔和金属五层；公开校正版图包未包含钝化层，因此第六层按实际金属焊盘位置重建。图层间距和厚度为便于观察而拉伸，不代表实物比例，也不是原始 GDS。",
    scale: "约 3 × 4 mm 裸片",
    evidence: "A",
    sourceIds: ["4004-archive", "intel-ipnc", "oral-history", "faggin"],
    scene: "mask",
  },
  {
    id: "quartz",
    number: "04",
    phase: "准备硅晶圆",
    title: "从石英中留下硅",
    takeaway: "芯片不是把沙子熔化就完成，真正困难的是把杂质降到极低。",
    action: "观察杂质光点逐渐离开硅晶体。",
    detail: "二氧化硅矿物先被还原成硅，再经历多级化学提纯成为电子级多晶硅。本场景解释工业共性，不指定 4004 的实际原料供应商。",
    scale: "原子纯度",
    evidence: "C",
    sourceIds: ["sumco"],
    scene: "quartz",
  },
  {
    id: "ingot",
    number: "05",
    phase: "准备硅晶圆",
    title: "拉出一根单晶硅锭",
    takeaway: "籽晶缓慢旋转上拉，让熔融硅排列成连续晶格。",
    action: "旋转观察硅锭中的规则晶格。",
    detail: "CZ 法把高纯多晶硅在石英坩埚中加热至约 1420℃，再由籽晶引导生长。具体到 4004 的供应链与配方并未公开。",
    scale: "厘米级硅锭",
    evidence: "B",
    sourceIds: ["sumco"],
    scene: "ingot",
  },
  {
    id: "wafer",
    number: "06",
    phase: "准备硅晶圆",
    title: "切成 2 英寸镜面晶圆",
    takeaway: "刚抛光好的晶圆只有连续镜面，还没有任何一颗裸片的边界。",
    action: "旋转晶圆，观察尚未经过光刻的完整硅表面。",
    detail: "硅锭经过切片、倒角、研磨、抛光和清洗，成为平整晶圆。4004 使用直径 2 英寸，也就是约 50.8 mm 的晶圆。裸片图形要等后续掩膜在晶圆上重复曝光和加工后才会出现；此时还不存在切割道或裸片划分。",
    scale: "50.8 mm",
    evidence: "A",
    sourceIds: ["intel-data", "sumco"],
    scene: "wafer",
  },
  {
    id: "oxidation",
    number: "07",
    phase: "构建晶体管",
    title: "先让硅长出绝缘层",
    takeaway: "二氧化硅既保护硅，也决定后续哪些区域可以被改变。",
    action: "倾斜剖面，观察乳白色氧化层覆盖硅表面。",
    detail: "晶圆表面先形成二氧化硅，再用有源区掩膜、光刻和刻蚀打开源极、漏极和栅极将要出现的位置。",
    scale: "微米级剖面",
    evidence: "B",
    sourceIds: ["faggin", "sia-front"],
    scene: "oxidation",
  },
  {
    id: "gate-oxide",
    number: "08",
    phase: "构建晶体管",
    title: "生长薄薄的栅氧",
    takeaway: "栅极不接触硅，却能隔着绝缘层用电场控制电流。",
    action: "从侧面查看薄栅氧如何只覆盖打开的有源区。",
    detail: "高质量薄氧化层隔开硅衬底与栅电极。对 PMOS 加入合适的负栅压后，源漏之间形成由空穴构成的导电沟道。",
    scale: "10 µm 晶体管",
    evidence: "B",
    sourceIds: ["faggin", "chm-silicon"],
    scene: "gate",
  },
  {
    id: "buried-contact",
    number: "09",
    phase: "构建晶体管",
    title: "为埋层接触打开窗口",
    takeaway: "让多晶硅在局部直接连接扩散区，可以少绕很长的金属线。",
    action: "沿高亮标记找到局部被打开、露出硅面的窗口。",
    detail: "埋层接触显著压缩随机逻辑面积。4004 是 MCS-4 四颗芯片中唯一使用这项结构的芯片。",
    scale: "局部互连",
    evidence: "A",
    sourceIds: ["faggin", "chm-silicon"],
    scene: "contact",
  },
  {
    id: "polysilicon",
    number: "10",
    phase: "构建晶体管",
    title: "沉积并刻出多晶硅栅",
    takeaway: "耐高温的多晶硅先成为栅极，也成为下一步的天然掩膜。",
    action: "旋转剖面，找到跨过薄氧化层的红色栅极。",
    detail: "同期工艺用硅烷在低压高温环境中沉积多晶硅，再通过光刻与刻蚀定义栅极和局部互连。",
    scale: "650—750℃ 沉积",
    evidence: "B",
    sourceIds: ["faggin"],
    scene: "poly",
  },
  {
    id: "doping",
    number: "11",
    phase: "构建晶体管",
    title: "用硼形成源极和漏极",
    takeaway: "栅极先站好位置，源漏便会自然贴着它的边界形成。",
    action: "观察浅绿色掺杂区域从两侧展开并停在栅极边缘。",
    detail: "硼进入没有被多晶硅保护的区域，形成 P 型源漏；栅极自身挡住掺杂，让源漏与栅极自动对准。",
    scale: "自对准边界",
    evidence: "B",
    sourceIds: ["faggin", "chm-silicon"],
    scene: "doping",
  },
  {
    id: "insulation",
    number: "12",
    phase: "连接整颗芯片",
    title: "再次覆盖绝缘层",
    takeaway: "晶体管先被绝缘层完整保护，接触孔将在下一步重新打开。",
    action: "从侧面查看氧化物如何贴着源、漏和栅极连续覆盖。",
    detail: "源、漏和栅表面重新形成保护氧化层，再沉积更厚的绝缘层，为上方金属互连提供隔离。",
    scale: "薄膜叠层",
    evidence: "B",
    sourceIds: ["faggin", "sia-front"],
    scene: "oxide",
  },
  {
    id: "metal",
    number: "13",
    phase: "连接整颗芯片",
    title: "打开接触孔并铺设铝线",
    takeaway: "晶体管负责开关，铝线负责把远处的开关连成一台计算机。",
    action: "沿蓝色金属总线追踪跨越裸片的连接。",
    detail: "绝缘层先被打开接触孔，再沉积并刻蚀铝，形成全局互连。多晶硅栅没有取代最终的铝连接层。",
    scale: "裸片全局互连",
    evidence: "B",
    sourceIds: ["faggin"],
    scene: "metal",
    bridge: {
      label: "视角转换",
      title: "把局部铝线放回整颗裸片",
      body: "这里先用剖面看清铝如何穿过接触孔。下一步会把镜头拉远到整颗 4004：蓝色金属没有消失，而是将被最后一层保护膜覆盖。",
    },
  },
  {
    id: "passivation",
    number: "14",
    phase: "连接整颗芯片",
    title: "盖上最后的保护层",
    takeaway: "整颗裸片被密封保护，只露出与外部世界连接的焊盘。",
    action: "关闭钝化层，对比保护膜下的金属互连与边缘焊盘。",
    detail: "钝化层隔绝污染与机械损伤，焊盘位置需要开口供后续引线键合。本场景下方五层使用公开校正版图；钝化开窗按金属层中的实际焊盘位置重建，垂直厚度为教学拉伸。",
    scale: "约 3 × 4 mm 裸片",
    evidence: "B",
    sourceIds: ["4004-archive", "intel-ipnc", "faggin"],
    scene: "passivation",
    bridge: {
      label: "承接上一步",
      title: "先找蓝色金属，再看保护膜留下什么",
      body: "画面默认只保留金属与钝化两层。先关闭浅绿色钝化层确认下方铝线，再重新打开：只有边缘焊盘需要露出，供后续探针和键合线接触。",
    },
  },
  {
    id: "probe",
    number: "15",
    phase: "挑出合格裸片",
    title: "在切开之前逐颗测试",
    takeaway: "先找到能工作的裸片，才值得为它付出封装成本。",
    action: "观察探针落下，绿色方格代表通过测试。",
    detail: "探针接触晶圆上每颗裸片的焊盘进行电气测试。缺陷可能损坏一颗裸片，却不会必然毁掉整片晶圆。",
    scale: "整片良率",
    evidence: "C",
    sourceIds: ["sia-back"],
    scene: "probe",
  },
  {
    id: "dicing",
    number: "16",
    phase: "挑出合格裸片",
    title: "沿切割道分开晶圆",
    takeaway: "晶圆上的重复图形，现在第一次成为一颗颗独立裸片。",
    action: "沿高亮切割道观察刀片如何避开每颗裸片的有源区。",
    detail: "晶圆沿裸片之间预留的切割道被分开，通过测试的裸片随后被挑选进入封装。",
    scale: "约 12 mm² 裸片",
    evidence: "C",
    sourceIds: ["sia-back"],
    scene: "dicing",
  },
  {
    id: "package",
    number: "17",
    phase: "连接外部世界",
    title: "固定、键合，再合上封盖",
    takeaway: "细金属线把显微世界里的焊盘，连接到手指可见的 16 个引脚。",
    action: "拖动查看封盖、键合线、裸片和引脚的爆炸结构。",
    detail: "裸片被固定在载体上，键合线连接到外部引脚，再由封装隔绝潮气与机械损伤。4004 使用 16 脚双列直插封装。",
    scale: "16 脚 DIP",
    evidence: "A",
    sourceIds: ["intel-data", "datasheet", "sia-back"],
    scene: "package",
  },
  {
    id: "calculator",
    number: "18",
    phase: "让它开始计算",
    title: "同一颗芯片，运行不同程序",
    takeaway: "制造到此结束，但微处理器的故事才刚开始。",
    action: "沿连线找到电路板上的 4004，再查看显示屏中的 56。",
    detail: "封装后的 4004 再次通过电气测试，随后进入 MCS-4 系统。硬件不变，只要改变 ROM 中的程序，它就能执行不同任务。",
    scale: "750 kHz · 4 bit",
    evidence: "A",
    sourceIds: ["intel-history", "datasheet", "sia-back"],
    scene: "calculator",
  },
];

export const quickStepIndexes = [0, 2, 4, 5, 7, 10, 14, 16, 17];

export const evidenceLabels: Record<EvidenceLevel, string> = {
  A: "4004 直接史料",
  B: "同期工艺还原",
  C: "教学简化",
};
