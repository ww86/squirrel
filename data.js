/**
 * 1. QUESTION DATA
 */
 const QUESTION_SET = [
   {
     id: "q1778421333895_zuoe5",
     type: "choice",
     prompt: "Do you feel nostalgic when it rains?",
     answers: [
       {
         label: "Never",
         personality: { axis1: -0.2, axis2: 0.2, axis3: 0.6, axis4: -0.4 },
         independent: { aura: 20, money: 0, pain: 1, charisma: 0, nuts: 1 },
         iq: 1,
       },
       {
         label: "Rarely",
         personality: { axis1: 0.0, axis2: -0.2, axis3: 0.2, axis4: -0.2 },
         independent: { aura: 1, money: 2, pain: 0, charisma: 2, nuts: 3 },
         iq: 3,
       },
       {
         label: "Sometimes",
         personality: { axis1: 0.0, axis2: -0.2, axis3: 0.0, axis4: 0.4 },
         independent: { aura: 2, money: 4, pain: 2, charisma: 6, nuts: 4 },
         iq: 4,
       },
       {
         label: "Often",
         personality: { axis1: 0.0, axis2: -0.6, axis3: 0.0, axis4: 0.4 },
         independent: { aura: 3, money: 5, pain: 5, charisma: 10, nuts: 5 },
         iq: 5,
       },
       {
         label: "Always",
         personality: { axis1: -0.2, axis2: -0.4, axis3: 0.6, axis4: 0.2 },
         independent: { aura: 5, money: 8, pain: 5, charisma: 4, nuts: 8 },
         iq: 8,
       }
     ],
   },
   {
     id: "q2",
     type: "choice",
     prompt: "While wandering through the forest, you happen upon a bear! What are you most likely to do?",
     answers: [
       {
         label: "Back away slowly avoiding eye contact, while preparing the bear spray. Bear encounters are usually harmless to squirrels.",
         personality: { axis1: 0.4, axis2: 0.0, axis3: 0.6, axis4: -0.4 },
         independent: { aura: 0, money: 1, pain: 5, charisma: 1, nuts: 1 },
         iq: 3,
       },
       {
         label: "Who cares about the bear? Check out that oak tree, it must be *loaded* with Acorns!",
         personality: { axis1: -0.2, axis2: 0.6, axis3: -0.6, axis4: -0.4 },
         independent: { aura: 5, money: 8, pain: 0, charisma: 3, nuts: 8 },
         iq: 8,
       },
       {
         label: "Observe the bear in awe, they are magnificent creatures. Try and understand what the bear is up to.",
         personality: { axis1: 0.2, axis2: -0.2, axis3: 0.0, axis4: 0.6 },
         independent: { aura: 1, money: 5, pain: 3, charisma: 8, nuts: 5 },
         iq: 5,
       },
       {
         label: "Ambush the bear from a tree and latch onto it's back. Let's ride!",
         personality: { axis1: -0.4, axis2: 1.0, axis3: -0.6, axis4: -0.4 },
         independent: { aura: 10, money: 2, pain: 0, charisma: 10, nuts: 2 },
         iq: 2,
       },
       {
         label: "Convince the bear into believing they owe you an Acorn with confusing sweet talk.",
         personality: { axis1: -0.6, axis2: 0.6, axis3: -0.4, axis4: 0.4 },
         independent: { aura: 3, money: 10, pain: 1, charisma: 5, nuts: 10 },
         iq: 10,
       }
     ],
   },
   {
     id: "q3",
     type: "choice",
     prompt: "The bunnies are holding a festive gathering, and everyone is invited. You've decided to attend. Upon arriving...",
     answers: [
       {
         label: "Join the cheerful and chattering group of bunnies in the main area. You like their vibe and are curious to meet them.",
         personality: { axis1: 0.2, axis2: 0.6, axis3: 0.0, axis4: 0.6 },
         independent: { aura: 1, money: 3, pain: 0, charisma: 10, nuts: 3 },
         iq: 3,
       },
       {
         label: "Join the hedgehogs who are taking turns to sing karaoke, and wait until it's your turn to sing.",
         personality: { axis1: 0.4, axis2: 0.4, axis3: -0.2, axis4: -0.2 },
         independent: { aura: 5, money: 1, pain: 1, charisma: 5, nuts: 1 },
         iq: 1,
       },
       {
         label: "You've heard that the bunnies have a collection of rare artifacts and books in the back room. You're curious to find out what they are.",
         personality: { axis1: -0.2, axis2: -0.4, axis3: 0.4, axis4: -0.6 },
         independent: { aura: 1, money: 3, pain: 5, charisma: 0, nuts: 3 },
         iq: 3,
       },
       {
         label: "Join the bat who seems to be a little sad and alone, and ask him or her how they like the party.",
         personality: { axis1: 0.4, axis2: -0.6, axis3: 0.2, axis4: 0.8 },
         independent: { aura: 8, money: 2, pain: 8, charisma: 8, nuts: 2 },
         iq: 2,
       },
       {
         label: "Join the raccoons in the dining area. You can't wait to get your hands on all the Nuts and Acorns! ",
         personality: { axis1: -0.2, axis2: 0.4, axis3: -0.2, axis4: -0.2 },
         independent: { aura: 3, money: 8, pain: 0, charisma: 3, nuts: 8 },
         iq: 8,
       },
       {
         label: "You join the owl and the raven, who are having a philosophical debate about ethics. You're very interested in their thoughts.",
         personality: { axis1: 0.4, axis2: -0.4, axis3: 0.2, axis4: -0.8 },
         independent: { aura: 1, money: 3, pain: 3, charisma: 3, nuts: 3 },
         iq: 3,
       }
     ],
   },
   {
     id: "q4",
     type: "choice",
     prompt: "You wake up in the middle of the night to strange noises. The weasel is stealing your acorns! What do you do?",
     answers: [
       {
         label: "Anything but the Acorns! You're out of the bed faster than lightning and ready to confront the weasel wielding a lamp!",
         personality: { axis1: -0.2, axis2: 0.8, axis3: -0.6, axis4: -0.4 },
         independent: { aura: 3, money: 5, pain: 5, charisma: 5, nuts: 5 },
         iq: 5,
       },
       {
         label: "You lock the bedroom door and call the squirrel police... Let them deal with the weasel. The Acorns are insured in case of burglaries, after all.",
         personality: { axis1: 0.6, axis2: -0.2, axis3: 0.6, axis4: -0.2 },
         independent: { aura: 1, money: 2, pain: 5, charisma: 1, nuts: 2 },
         iq: 2,
       },
       {
         label: "That foul creature doesn't know the extent of the mistake they have just made! You prepare a fireball spell from your spellbook.",
         personality: { axis1: -0.6, axis2: -0.4, axis3: 0.6, axis4: -0.6 },
         independent: { aura: 8, money: 3, pain: 8, charisma: 1, nuts: 3 },
         iq: 3,
       },
       {
         label: "The weasel isn't too bright, is he? You decide you'll try and talk them out of it telling him that your neighbour has twice the amount of Acorns you do.",
         personality: { axis1: -0.4, axis2: 0.4, axis3: -0.6, axis4: 0.4 },
         independent: { aura: 3, money: 10, pain: 1, charisma: 5, nuts: 10 },
         iq: 10,
       },
       {
         label: "You sneak to the entrance of the Acorn storage room, and peek inside. Does the weasel look mad? They're your last Acorns, maybe he reconsiders if you tell him.",
         personality: { axis1: 0.2, axis2: -0.4, axis3: 0.2, axis4: 0.6 },
         independent: { aura: 1, money: 1, pain: 5, charisma: 10, nuts: 1 },
         iq: 1,
       },
       {
         label: "You start laughing maniacally and set the entire house on fire! Either they're your Acorns, or they're nobody's Acorns! Ha ha haa!",
         personality: { axis1: -1.0, axis2: -0.4, axis3: -0.8, axis4: -0.8 },
         independent: { aura: 10, money: 1, pain: 10, charisma: 1, nuts: 1 },
         iq: 5,
       }
     ],
   },
   {
     id: "q5",
     type: "choice",
     prompt: "A group of Lobster investors with curly moustaches and tiny top hats wants to buy and cut down the forest to build a casino resort... ",
     answers: [
       {
         label: "Hope for the best, there's nothing you can do: The Crustacean Investments and Acquisitions Co., Ltd. is too powerful.",
         personality: { axis1: 0.2, axis2: -0.8, axis3: 0.2, axis4: 0.2 },
         independent: { aura: 0, money: 1, pain: 5, charisma: 3, nuts: 1 },
         iq: 1,
       },
       {
         label: "Chain yourself to a tree! Beaver Lumberjacks might refuse to cut down trees with squirrels on them. ",
         personality: { axis1: 0.0, axis2: 0.0, axis3: -0.4, axis4: 0.2 },
         independent: { aura: 5, money: 1, pain: 5, charisma: 5, nuts: 1 },
         iq: 1,
       },
       {
         label: "Terrorise the Lobster cocktail parties with stinky cheese! If the price negotiations are impossible, the Lobsters can't purchase the forest.",
         personality: { axis1: -0.6, axis2: 0.6, axis3: -0.4, axis4: -0.6 },
         independent: { aura: 10, money: 3, pain: 1, charisma: 3, nuts: 3 },
         iq: 3,
       },
       {
         label: "Why would you do anything? When the Lobsters cut down the forest, you can collect all the Acorns and ship them away to your hideout!",
         personality: { axis1: -0.6, axis2: -0.4, axis3: -0.2, axis4: -0.8 },
         independent: { aura: 2, money: 10, pain: 1, charisma: 1, nuts: 10 },
         iq: 10,
       },
       {
         label: "Convene all the squirrels to a meeting and discuss the best strategy to avoid this calamity.",
         personality: { axis1: 0.6, axis2: 0.4, axis3: 0.4, axis4: 0.2 },
         independent: { aura: 8, money: 5, pain: 1, charisma: 5, nuts: 5 },
         iq: 5,
       },
       {
         label: "Appoint a meeting with the Boss Lobster and sweet talk him into reconsidering the project and sympathising with the squirrels. ",
         personality: { axis1: 0.6, axis2: 0.4, axis3: -0.4, axis4: 0.6 },
         independent: { aura: 5, money: 3, pain: 3, charisma: 12, nuts: 3 },
         iq: 3,
       }
     ],
   },
   {
     id: "q6",
     type: "choice",
     prompt: "Which of the following would you take with you on a deserted island?",
     answers: [
       {
         label: "A companion. Of course!",
         personality: { axis1: 0.2, axis2: -0.2, axis3: 0.0, axis4: 0.4 },
         independent: { aura: 1, money: 3, pain: 3, charisma: 8, nuts: 3 },
         iq: 3,
       },
       {
         label: "Acorns. Of course!",
         personality: { axis1: -0.2, axis2: 0.2, axis3: -0.2, axis4: -0.2 },
         independent: { aura: 3, money: 10, pain: 1, charisma: 1, nuts: 10 },
         iq: 10,
       },
       {
         label: "A length of rope and tools.",
         personality: { axis1: 0.2, axis2: 0.2, axis3: 0.4, axis4: -0.2 },
         independent: { aura: 1, money: 5, pain: 0, charisma: 1, nuts: 5 },
         iq: 5,
       },
       {
         label: "A boat and supplies.",
         personality: { axis1: -0.2, axis2: -0.2, axis3: 0.2, axis4: -0.4 },
         independent: { aura: 10, money: 8, pain: 5, charisma: 1, nuts: 8 },
         iq: 8,
       }
     ],
   },
   {
     id: "q7",
     type: "choice",
     prompt: "An Evil Black Wizard has captured you while you were taking a nap out in the field. You find yourself in a cage atop a dark tower. The wizard seems to be gone - obviously it's an evil wizard's tower - and they could be back any moment...",
     answers: [
       {
         label: "You pick the lock with your nimble and dextrous squirrel fingers. Once out of the cage, you'll just use your tail as a parachute and glide away. So long, Evil Black Wizard!",
         personality: { axis1: -0.2, axis2: 0.6, axis3: -0.8, axis4: -0.4 },
         independent: { aura: 5, money: 3, pain: 0, charisma: 5, nuts: 3 },
         iq: 3,
       },
       {
         label: "Kind of kinky!? You wonder if The Evil Black Wizard is your type while observing your surroundings.",
         personality: { axis1: 0.0, axis2: -0.6, axis3: 0.2, axis4: 0.6 },
         independent: { aura: 5, money: 1, pain: 1, charisma: 8, nuts: 1 },
         iq: 1,
       },
       {
         label: "Little does he know you are also an Evil Black Wizard! You prepare for an epic wizard duel.",
         personality: { axis1: -0.6, axis2: -0.2, axis3: 0.4, axis4: -0.6 },
         independent: { aura: 10, money: 3, pain: 3, charisma: 3, nuts: 3 },
         iq: 6,
       },
       {
         label: "The Evil Black Wizard seems to have a cache of Acorns next to the fireplace. You tip the cage over and roll it to the cache, and proceed to eat all his Acorns. Ha ha haa!",
         personality: { axis1: -0.8, axis2: 0.6, axis3: -0.4, axis4: -0.4 },
         independent: { aura: 10, money: 10, pain: 5, charisma: 1, nuts: 10 },
         iq: 10,
       },
       {
         label: "You prepare to persuade the Evil Black Wizard into letting you go.",
         personality: { axis1: 0.4, axis2: -0.2, axis3: 0.2, axis4: 0.2 },
         independent: { aura: 1, money: 2, pain: 2, charisma: 10, nuts: 2 },
         iq: 2,
       },
       {
         label: "Try not to panic, and come up with a plan.",
         personality: { axis1: 0.2, axis2: -0.2, axis3: 0.4, axis4: -0.4 },
         independent: { aura: 2, money: 2, pain: 4, charisma: 2, nuts: 2 },
         iq: 2,
       }
     ],
   }
 ];
/**
 * 2. SCORING & ARCHETYPE DATA
 */
const AXES_LABELS = [
  { id: "axis1", neg: "Malevolence",    pos: "Conscientiousness" },
  { id: "axis2", neg: "Melancholy",     pos: "Energy"            },
  { id: "axis3", neg: "Creativity",     pos: "Organization"      },
  { id: "axis4", neg: "Wisdom",         pos: "Attunement"        },

];

const IQ_THRESHOLDS = [
  { min: 175, text: "Supersciurid",               color: "#22A", image: "iq_supersciurid.jpg" },
  { min: 164, text: "Cosmos Brain",               color: "#22A", image: "iq_cosmos_brain.png" },
  { min: 147, text: "Galaxy Brain",               color: "#22A", image: "iq_galaxy_brain.jpg" },
  { min: 134, text: "Cosmic Genius",              color: "#22A", image: "iq_cosmic_genius.png" },
  { min: 101, text: "Genius",                     color: "#22A", image: "iq_genius.png" },
  { min: 100, text: "Normal",                     color: "#888", image: "iq_normal.jpg" },
];

const ARCHETYPES = {
  "----": { name: "The Chaos Monk",           image: "----.png", desc: "You live in the forest as a hermit, with your lantern by your side, wailing and complaining all alone." },
  "---+": { name: "The Druid",                image: "---+.png", desc: "You rarely remember where you buried the nuts you harvested last summer, little birds keep you company while you look for them." },
  "--+-": { name: "The Black Wizard",         image: "--+-.png", desc: "You spend your days preparing powerful spells to cast this rotting world into darkness." },
  "--++": { name: "The Empress",              image: "--++.jpg", desc: "You commune with the spirits of the nether world, and mortals worship you." },
  "-+--": { name: "The Wanderer",             image: "-+--.png", desc: "You are a warrior captured by wanderlust, constantly in motion, and the other animals of the forest fear you." },
  "-+-+": { name: "The Evil Twink",           image: "-+-+.jpg", desc: "You are the Macchiavellian Evil, sowing the seeds of chaos everywhere and stealing nuts from other squirrels." },
  "-++-": { name: "The Vigilante",            image: "-++-.png", desc: "At night, you're the supersquirrel; At day, you're an accountant." },
  "-+++": { name: "The Raver",                image: "-+++.jpg", desc: "You try and convince others to trade their acorns for used cars, so you can afford to go to dance clubs." },
  "+---": { name: "The Architect",            image: "+---.jpg", desc: "You are drawn to Cathedrals and appreciate the beauty of the natural world." },
  "+--+": { name: "The Goth",                 image: "+--+.png", desc: "Appalled, you express the pain and suffering in this world through art." },
  "+-+-": { name: "The Control Freak",        image: "+-+-.png", desc: "You've dedicated your life for mathematics, and for bringing down your arch nemesis, the Evil Twink." },
  "+-++": { name: "The Cat Lady",             image: "+-++.png", desc: "You'd like to have a rescue animal shelter, and you spend your time talking to the dozen cats that you live with, and they talk to you too." },
  "++--": { name: "The Shining One",          image: "++--.png", desc: "You've transcended into a higher-squirrel-being illuminating your surroundings with bright light. Too bright." },
  "++-+": { name: "The Socialite",            image: "++-+.png", desc: "You are the life of the party, or the chaos, even." },
  "+++-": { name: "The Knight",               image: "+++-.jpg", desc: "You're the boss. Or at least that's what you think." },
  "++++": { name: "The Secretary",            image: "++++.png", desc: "Everyone loves to be around you, and you make sure everything is always right for everyone." },
};

const INDEPENDENT_VARS = [
  { id: "aura",     label: "Aura"     },
  { id: "money",    label: "Money"    },
  { id: "pain",     label: "Pain"     },
  { id: "charisma", label: "Charisma" },
  { id: "nuts",     label: "Nuts"     },
];
