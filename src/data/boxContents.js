// Data for the magical miniature world inside the 3D Gift Box
// Follows strict emotional rules: natural affection, care, subtle sweetness, zero friendship labels.

export const boxContentsData = {
  letter: {
    label: "A little note, just for you.",
    title: "A Quiet Reflection",
    date: "Day 100 Milestone",
    message: `Dear Commander Estelle,

If you are reading this, it means you opened the package.

I wanted to make something that felt personal and thoughtful—a little space in the digital universe dedicated to you and the past 100 days.

Between the late-night exchanges, the completely random debates, and the quiet moments where an unexpected notification made everything feel lighter, these days have been genuinely lovely.

Thank you for being someone who makes conversations feel so effortless, warm, and natural.

— Yours Lovingly, Silly Goose`
  },

  polaroids: [
    {
      id: 1,
      title: "The First Transmission",
      caption: "Where two paths crossed in the digital cosmos ✨",
      subcaption: "Day 01 • Coordinates recorded",
      defaultImage: "/src/assets/images/photo1.jpg",
      artType: "galaxy",
      reflection: "It began with a simple hello, completely unaware of how many smiles would follow."
    },
    {
      id: 2,
      title: "Uncontrolled Giggles",
      caption: "Unlimited topics, zero filter, pure chaos 😄",
      subcaption: "Transmission log: 4000+ topics",
      defaultImage: "/src/assets/images/photo3.jpg",
      artType: "laugh",
      reflection: "No matter how serious either of us attempts to be, laughter always wins."
    },
    {
      id: 3,
      title: "A Hundred Good Days",
      caption: "One hundred little chapters, still turning 📖",
      subcaption: "Milestone reached • Still interesting",
      defaultImage: "/src/assets/images/photo5.jpg",
      artType: "celebration",
      reflection: "Reaching 100 days of effortless conversation is something rare and genuinely special."
    }
  ],

  miniCards: [
    {
      id: 1,
      numeral: "I",
      theme: "Spontaneous Spark",
      title: "The Unexpected Spark",
      motto: "Small moments that alter entire days.",
      color: "#FFF2F6",
      accent: "#C97A8F",
      goldTrim: "#E5A9B8",
      seal: "✦",
      quote: "Some people plan their days down to the minute, and then there are the rare ones who can drop a single spontaneous sentence and turn a completely routine afternoon into a memorable highlight.",
      note: "You have that knack without even trying—making ordinary moments feel brighter.",
      interactionType: "sparks",
      sparksList: [
        "If animals could talk, which one would be the rudest? (Definitely geese.)",
        "Is cereal technically cold soup? An urgent diplomatic inquiry is required.",
        "What is the most delightfully chaotic thing we could do in the next 10 minutes?",
        "Hypothesis: Late-night snacks taste 40% better when discussed with you."
      ]
    },
    {
      id: 2,
      numeral: "II",
      theme: "Midnight Tangents",
      title: "The Midnight Rabbit Hole",
      motto: "Where no topic ever stays on its original track.",
      color: "#F7F2FD",
      accent: "#7B5E99",
      goldTrim: "#A78AC7",
      seal: "🌙",
      quote: "No conversation with you ever follows a straight line. What begins as a simple question about dinner somehow evolves into an in-depth debate on parallel universes and historical mishaps by midnight.",
      note: "The best conversations are the ones where you forget where you even started.",
      interactionType: "tangents",
      tangentLevels: [
        { label: "Mild Banter", desc: "Safe territory: weather, favorite drinks, what went comically wrong today.", badge: "Level 1" },
        { label: "Unhinged Debate", desc: "Current thesis: Time travel should strictly be used to acquire snacks from other eras.", badge: "Level 2" },
        { label: "Full Multiverse", desc: "At 1:47 AM, standard logic is completely dissolved. Only laughter and vibes remain.", badge: "Level 3" }
      ]
    },
    {
      id: 3,
      numeral: "III",
      theme: "Quiet Sanctuary",
      title: "The Quiet Comfort",
      motto: "Zero filters. Zero expectations. Just effortless ease.",
      color: "#FFFDF6",
      accent: "#B58A38",
      goldTrim: "#D4AF37",
      seal: "☕",
      quote: "The rarest kind of connection isn't the loudest one—it's the one where you never have to filter your thoughts or pretend to be anything other than yourself. A quiet check-in, an unprompted laugh, and the simple comfort of knowing you're understood.",
      note: "A peaceful harbor whenever the outside world gets a little too loud.",
      interactionType: "comfort",
      comfortMessages: [
        "Take a slow breath. Whatever you're tackling today, you've got this.",
        "Reminder: You don't have to carry the whole universe by yourself today.",
        "This corner is always open whenever you need a peaceful laugh or a quiet pause."
      ]
    },
    {
      id: 4,
      numeral: "IV",
      theme: "Commander's Codex",
      title: "The Commander's Law",
      motto: "Under Article 100: Estelle is always right.",
      color: "#FAF0F8",
      accent: "#8B4789",
      goldTrim: "#B86CAE",
      seal: "⚡",
      quote: "Under Official Commander Directive #100: Commander Estelle is fully authorized to double down on an argument, change the subject with zero warning, and blame any resulting confusion on cosmic interference.",
      note: "Executive decree: No appeals, no refunds, 100% immunity from boredom.",
      interactionType: "stamp",
      stampDetails: {
        sealName: "OFFICIAL COMMANDER ESTELLE STAMP",
        verdict: "APPROVED WITH HIGHEST CLEARANCE",
        subnote: "Certified 100% Unpredictable & Wonderfully Entertaining"
      }
    },
    {
      id: 5,
      numeral: "V",
      theme: "100-Day Milestone",
      title: "The Starlight Promise",
      motto: "A hundred shared days, and many more to come.",
      color: "#FFF9EB",
      accent: "#C59B27",
      goldTrim: "#E5BE53",
      seal: "🌟",
      quote: "A hundred days isn't just a number on a calendar; it's a hundred little moments of shared laughter, quiet check-ins, and memories that quietly became treasured. Here’s to every conversation that made this journey so wonderful.",
      note: "Here is to the unwritten chapters, the unplanned laughs, and the road ahead.",
      interactionType: "wish",
      wishBanner: "✦ TO A HUNDRED MORE SHARED SMILES ✦",
      wishQuote: "May your days stay as luminous, amusing, and wonderfully unpredictable as the last 100 days have been."
    }
  ],

  mysteryGift: {
    title: "THE MYSTERY GIFT",
    subtitle: "A Little Something Extra",
    alert: "SECRET DISPATCH UNLOCKED!",
    message: "You officially hold the highest clearance in this communication network.",
    detail: "Commander Rating: 100/10. No objections accepted. No refunds, no exchanges. Just genuine appreciation for who you are.",
    stamp: "TOP SECRET • COMMANDER CLEARANCE ONLY"
  }
};
