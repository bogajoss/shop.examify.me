export interface Course {
  id: string;
  title: string;
  category: string;
  price: number;
  oldPrice: number;
  students: number;
  status: "Published" | "Draft";
  batch: string;
  batchId: string; // UUID of the batch
  description: string;
  features: string[];
  icon_url?: string;
  routine_url?: string;
  live_exams?: string;
  lecture_notes?: string;
  standard_exams?: string;
  solve_sheets?: string;
  batch_stats?: { label: string; value: string }[];
}

export interface FreeExam {
  id: string;
  title: string;
  subject: string;
  time: string;
  questions: number;
  students: number;
}

export interface Question {
  id: number;
  q: string;
  tag: string;
  options: string[];
  ans: number;
  locked?: boolean;
  img?: string;
  explain?: string;
}

export interface CQSubQuestion {
  label: string;
  text: string;
  answer: string;
}

export interface CQQuestion {
  id: number;
  stem: string;
  tag: string;
  questions: CQSubQuestion[];
}

export interface QuestionBankItem {
  id: string;
  title: string;
  category: string;
  isLive: boolean;
  type?: "mcq" | "cq";
  image: string;
}

export interface Order {
  id: string;
  student: string;
  phone: string;
  courseId: string;
  courseName: string;
  amount: number;
  status: "Pending" | "Approved" | "Rejected";
  token: string | null;
  adminComment?: string | null;
  date: string;
}

export interface User {
  name: string;
  phone: string;
  enrolledCourses: Course[];
  orders: Order[];
}

export interface LeaderboardEntry {
  name: string;
  score: string;
  time: string;
  rank: number;
}

export const db = {
  courses: [
    // ... existing courses
    {
      id: "C-001",
      title: "2nd Timer Full Course",
      category: "Admission",
      price: 4500,
      oldPrice: 5500,
      students: 450,
      status: "Published",
      batch: "HSC 25",
      batchId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      description:
        "একাডেমিক এবং বিশ্ববিদ্যালয় ভর্তি পরীক্ষার পূর্ণাঙ্গ প্রস্তুতি। সেকেন্ড টাইমারদের জন্য বিশেষায়িত কেয়ার এবং এক্সাম সিস্টেম।",
    },
    {
      id: "C-002",
      title: "HSC 26 - Biology Cycle 1",
      category: "HSC Academic",
      price: 1500,
      oldPrice: 2000,
      students: 120,
      status: "Published",
      batch: "HSC 26",
      batchId: "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12",
      description:
        "এইচএসসি ২৬ ব্যাচের জন্য বায়োলজি সাইকেল ১। মানব শরীরতত্ত্ব এবং কোষ ও কোষের গঠন।",
    },
    {
      id: "C-003",
      title: "Admission Full Exam Batch",
      category: "Admission",
      price: 2000,
      oldPrice: 3000,
      students: 800,
      status: "Published",
      batch: "HSC 25",
      batchId: "c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13",
      description: "শুধুমাত্র এক্সাম ব্যাচ। ডেইলি এক্সাম, উইকলি টেস্ট এবং সলভ ক্লাস।",
    },
  ] as Course[],
  freeExams: [
    {
      id: "FE-001",
      title: "Biology Weekly Model Test",
      subject: "Biology",
      time: "20 min",
      questions: 3,
      students: 1200,
    },
    {
      id: "FE-002",
      title: "Chemistry Chapter 3 Quiz",
      subject: "Chemistry",
      time: "15 min",
      questions: 3,
      students: 850,
    },
    {
      id: "FE-003",
      title: "Admission GK & English Test",
      subject: "GK & English",
      time: "10 min",
      questions: 3,
      students: 2000,
    },
  ] as FreeExam[],
  questionBanks: [
    {
      id: "QB-CQ-001",
      title: "HSC ICT Test Paper (CQ)",
      category: "model-test",
      isLive: true,
      type: "cq",
      image: "https://placehold.co/400x400?text=ICT+CQ",
    },
    {
      id: "QB-001",
      title: "Admission Model Test-2025(Science)",
      category: "model-test",
      isLive: true,
      type: "mcq",
      image: "https://placehold.co/400x400?text=Model+Test",
    },
    {
      id: "QB-002",
      title: 'Varsity "Ka" 2nd Timer Model Test-2025',
      category: "model-test",
      isLive: true,
      type: "mcq",
      image: "https://placehold.co/400x400?text=Varsity+A",
    },
    {
      id: "QB-003",
      title: 'Varsity "Kha" 2nd Timer Model Test-2025',
      category: "model-test",
      isLive: true,
      type: "mcq",
      image: "https://placehold.co/400x400?text=Varsity+B",
    },
    {
      id: "QB-004",
      title: "Engineering weekly 2025",
      category: "model-test",
      isLive: true,
      type: "mcq",
      image: "https://placehold.co/400x400?text=Engineering",
    },
    {
      id: "QB-005",
      title: "Admission weekly - 2025",
      category: "model-test",
      isLive: true,
      type: "mcq",
      image: "https://placehold.co/400x400?text=Admission",
    },
  ] as QuestionBankItem[],
  qbQuestions: [
    {
      id: 2,
      q: "তৃতীয় টেবিল তৈরির প্রয়োজন পড়ে কোনটিতে?",
      tag: "CCC 20",
      options: ["One to many", "Many to one", "One to one", "Many to many"],
      ans: 3,
      locked: true,
    },
    {
      id: 3,
      q: "টেবিলদ্বয়ের মধ্যে কিরূপ সম্পর্ক বিদ্যমান?",
      img: "https://placehold.co/600x200?text=Table+Image",
      tag: "PCC 20",
      options: ["One to one", "One to many", "Many to one", "Many to many"],
      ans: 0,
      locked: true,
    },
    {
      id: 4,
      q: "কোন অনুবাদক একবারে কোড চেক করে?",
      tag: "BCC 23",
      options: ["ইন্টারপ্রেটার", "কম্পাইলার", "অ্যাসেম্বলার", "ইন্টারপ্রিটর"],
      ans: 1,
      locked: true,
    },
    {
      id: 5,
      q: "কোন কী এর সাহায্যে নির্দিষ্ট রেকর্ড/তথ্য খোঁজা হয়?",
      tag: "JGCC 20",
      options: ["ফরেন কী", "মৌলিক কী", "প্রাইমারি কী", "কম্পোজিট কী"],
      ans: 2,
      locked: true,
    },
    {
      id: 6,
      q: "শিক্ষক স্বল্পতার কারণে বাংলা শিক্ষক মোস্তাক সাহেবকে ইংরেজি, বাংলা ও গণিত ক্লাস নিতে হয়। উল্লিখিত পরিস্থিতি ডেটাবেজের কোন ধরনের রিলেশনকে ইঙ্গিত করে?",
      tag: "MAD.B 17",
      options: ["ওয়ান টু ওয়ান", "মেনি টু ওয়ান", "ওয়ান টু মেনি", "মেনি টু মেনি"],
      ans: 2,
      locked: true,
    },
    {
      id: 7,
      q: "টেবিল দুটির মধ্যে রিলেশন কোন ধরনের?",
      tag: "BB 17",
      options: ["One to one", "One to many", "Many to one", "Many to many"],
      ans: 0,
      locked: true,
    },
    {
      id: 8,
      q: "A ও B টেবিল এর মধ্যে রিলেশন স্থাপনের জন্য প্রয়োজন হবে- <br>(i) A টেবিলে একটি প্রাইমারি কী <br>(ii) B টেবিলে একটি ফরেন কী <br>(iii) A ও B টেবিল এর জাংশন টেবিল <br>নিচের কোনটি সঠিক?",
      tag: "RB 19",
      options: ["i, ii", "i, iii", "ii, iii", "i, ii, iii"],
      ans: 0,
      locked: true,
    },
    {
      id: 9,
      q: "‘অ্যাসোসিয়েশন ভোট টেবিল’ কোন রিলেশনে গঠিত হয়?",
      tag: "CTG.B 19",
      options: ["One to one", "One to many", "Many to One", "Many to Many"],
      ans: 3,
      locked: true,
    },
    {
      id: 10,
      q: ">= কোন ধরনের অপারেটর?",
      tag: "NDCM 23",
      options: ["কন্ডিশনাল", "গাণিতিক", "লজিক্যাল", "রিলেশনাল"],
      ans: 3,
      locked: true,
    },
  ] as Question[],
  cqQuestions: {
    "QB-CQ-001": [
      {
        id: 2,
        stem: "ডাঃ ফারিহা শহরের কর্মস্থলে অবস্থান করেও প্রত্যন্ত অঞ্চলের নাগরিকদের চিকিৎসা সেবা দিয়ে থাকেন। তিনি কৃত্রিম পরিবেশে অপারেশনের প্রশিক্ষণ গ্রহণ করেছেন।",
        tag: "CTG.B 16",
        questions: [
          {
            label: "ক",
            text: "হ্যাকিং কী?",
            answer: "কম্পিউটার বা নেটওয়ার্কে অবৈধ প্রবেশ।",
          },
          {
            label: "খ",
            text: "“যন্ত্র স্বয়ংক্রিয়ভাবে কাজ করে”- ব্যাখ্যা কর ।",
            answer: "রোবোটিক্স ও এআই ব্যবহারের মাধ্যমে যন্ত্র মানুষের সাহায্য ছাড়াই কাজ করে।",
          },
          {
            label: "গ",
            text: "ডাঃ ফারিহা কীভাবে চিকিৎসা সেবা দিয়ে থাকেন? ব্যাখ্যা কর।",
            answer: "তিনি টেলিমেডিসিন প্রযুক্তি ব্যবহার করে দূরবর্তী স্থানে সেবা দিচ্ছেন।",
          },
          {
            label: "ঘ",
            text: "ডাঃ ফারিহার প্রশিক্ষণে ব্যবহৃত প্রযুক্তিটি প্রাত্যহিক জীবনে কী প্রভাব রাখছে? আলোচনা কর ।",
            answer:
              "তিনি ভার্চুয়াল রিয়েলিটি (VR) প্রযুক্তি ব্যবহার করেছেন যা প্রশিক্ষণকে নিরাপদ ও সহজ করেছে।",
          },
        ],
      },
      {
        id: 3,
        stem: "উদ্দীপকটি মনোযোগ সহকারে পড়ো এবং প্রশ্নগুলোর উত্তর দাও: <br> আহমেদ চৌধুরী পরীক্ষা সংক্রান্ত প্রজেক্ট পেপার তৈরির জন্য ইন্টারনেটের সাহায্য নেন। তিনি নিয়ম মেনে প্রতিটি তথ্যের উৎস উল্লেখ করেন। কিন্তু আজিম ইন্টারনেট থেকে বিভিন্ন ফাইলের সফট কপি সংগ্রহ করে উৎস উল্লেখ না করে নিজের নামে ঐ ফাইলগুলো প্রকাশ করেন।",
        tag: "BCC 24",
        questions: [
          {
            label: "ক",
            text: "বায়োইনফরমেটিক্স কী?",
            answer: "জীববিজ্ঞান ও কম্পিউটার বিজ্ঞানের সমন্বয়ে গঠিত একটি ক্ষেত্র।",
          },
          {
            label: "খ",
            text: '"বাস্তব জগতে কল্পনাকে স্পর্শ করা সম্ভব"-ব্যাখ্যা করো।',
            answer: "ভার্চুয়াল রিয়েলিটির মাধ্যমে এটি সম্ভব।",
          },
          {
            label: "গ",
            text: "উদ্দীপকে উল্লিখিত প্রযুক্তিটি ব্যাখ্যা করো।",
            answer: "এখানে প্লেজিয়ারিজম (Plagiarism) বা কুম্ভীলকবৃত্তির কথা বলা হয়েছে।",
          },
          {
            label: "ঘ",
            text: "তথ্য প্রযুক্তির নৈতিকতার ভিত্তিতে আহমেদ চৌধুরী ও আজিমের আচরণ মূল্যায়ন করো।",
            answer:
              "আহমেদ চৌধুরী নৈতিকতা মেনেছেন, কিন্তু আজিম কপিরাইট আইন ভঙ্গ করেছেন।",
          },
        ],
      },
    ] as CQQuestion[],
  } as Record<string, CQQuestion[]>,
  examQuestions: {
    "FE-001": [
      {
        id: 1,
        q: "মানবদেহে ক্রোমোজোম সংখ্যা কত?",
        tag: "Biology",
        options: ["২৩ জোড়া", "২২ জোড়া", "৪৪ টি", "৪৬ জোড়া"],
        ans: 0,
        explain:
          "মানবদেহে ২৩ জোড়া বা ৪৬টি ক্রোমোজোম থাকে। এর মধ্যে ২২ জোড়া অটোজোম এবং ১ জোড়া সেক্স ক্রোমোজোম।",
      },
      {
        id: 2,
        q: "মাইটোকন্ড্রিয়ার কাজ কী?",
        tag: "Biology",
        options: ["শক্তি উৎপাদন", "প্রোটিন সংশ্লেষ", "সালোকসংশ্লেষণ", "লিপিড তৈরি"],
        ans: 0,
        explain:
          "মাইটোকন্ড্রিয়া কোষের যাবতীয় জৈবিক কাজের জন্য শক্তি উৎপাদন করে, তাই একে কোষের শক্তিঘর বা Power House বলা হয়।",
      },
      {
        id: 3,
        q: "রক্তের গ্রুপ কয়টি?",
        tag: "Biology",
        options: ["২টি", "৩টি", "৪টি", "৫টি"],
        ans: 2,
        explain: "ABO পদ্ধতি অনুযায়ী মানুষের রক্তের গ্রুপ ৪টি: A, B, AB এবং O।",
      },
    ],
    "FE-002": [
      {
        id: 1,
        q: "পানির রাসায়নিক সংকেত কী?",
        tag: "Chemistry",
        options: ["H2O", "CO2", "O2", "NaCl"],
        ans: 0,
        explain:
          "পানির রাসায়নিক সংকেত H2O, অর্থাৎ দুই পরমাণু হাইড্রোজেন ও এক পরমাণু অক্সিজেনের সমন্বয়ে পানি গঠিত।",
      },
      {
        id: 2,
        q: "নিচের কোনটি ক্ষারীয় ধাতু?",
        tag: "Chemistry",
        options: ["Na", "Fe", "Al", "Au"],
        ans: 0,
        explain: "সোডিয়াম (Na) একটি ক্ষারীয় ধাতু যা পর্যায় সারণির গ্রুপ ১-এ অবস্থিত।",
      },
      {
        id: 3,
        q: "PH এর মান ৭ হলে সেটি কী?",
        tag: "Chemistry",
        options: ["অম্লীয়", "ক্ষারীয়", "নিরপেক্ষ", "কোনোটিই না"],
        ans: 2,
        explain:
          "PH স্কেলে ৭ হলো নিরপেক্ষ মান। ৭ এর নিচে অম্লীয় এবং ৭ এর উপরে ক্ষারীয়।",
      },
    ],
    "FE-003": [
      {
        id: 1,
        q: 'What is the synonym of "Happy"?',
        tag: "English",
        options: ["Sad", "Joyful", "Angry", "Boring"],
        ans: 1,
        explain:
          '"Joyful" means feeling, expressing, or causing great pleasure and happiness.',
      },
      {
        id: 2,
        q: "বাংলাদেশের জাতীয় খেলা কোনটি?",
        tag: "GK",
        options: ["ক্রিকেট", "ফুটবল", "কাবাডি", "হকি"],
        ans: 2,
        explain: "হাডুডু বা কাবাডি বাংলাদেশের জাতীয় খেলা।",
      },
      {
        id: 3,
        q: "Which one is a noun?",
        tag: "English",
        options: ["Run", "Beautiful", "Dhaka", "Quickly"],
        ans: 2,
        explain: '"Dhaka" is the name of a place, so it is a Proper Noun.',
      },
    ],
  } as Record<string, Question[]>,
  categories: [
    { id: 1, name: "HSC Academic", slug: "hsc-academic", count: 12 },
    { id: 2, name: "Admission", slug: "admission", count: 5 },
    { id: 3, name: "Model Test", slug: "model-test", count: 8 },
  ],
  initialOrders: [
    {
      id: "ORD-101",
      student: "Tanvir Hasan",
      phone: "01700000000",
      courseId: "C-001",
      courseName: "2nd Timer Full Course",
      amount: 4500,
      status: "Approved",
      token: "EXM-DEMO",
      date: "14 Jan, 2026",
    },
  ] as Order[],
  leaderboards: {
    "FE-001": [
      { name: "Tanvir Hasan", score: "3/3", time: "01:45", rank: 1 },
      { name: "Sadia Afrin", score: "2.75/3", time: "02:12", rank: 2 },
      { name: "Rahim Uddin", score: "2/3", time: "02:30", rank: 3 },
    ],
    "FE-002": [
      { name: "Karim Mia", score: "3/3", time: "01:10", rank: 1 },
      { name: "Fatema Begum", score: "2.75/3", time: "01:50", rank: 2 },
      { name: "Jamil Ahmed", score: "2.5/3", time: "02:00", rank: 3 },
    ],
    "FE-003": [
      { name: "Anika Tahsin", score: "3/3", time: "00:55", rank: 1 },
      { name: "Sabbir Hossain", score: "3/3", time: "01:05", rank: 2 },
      { name: "Nusrat Jahan", score: "2.75/3", time: "01:20", rank: 3 },
    ],
  } as Record<string, LeaderboardEntry[]>,
};
