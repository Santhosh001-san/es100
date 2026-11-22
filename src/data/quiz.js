// Fun Challenge Quiz Data for Commander Estelle
// SECRET LOGIC: Commander is ALWAYS the winner in all 5 questions.
// If "Commander" is picked: funny, flattering response celebrating her.
// If "Me" is picked: playful response showing him as the innocent, sensible, good-hearted person while Commander still wins!

export const quizData = {
  title: "COMMANDER TACTICAL TEST",
  subtitle: "Answer honestly, Commander Estelle. Every answer is classified and officially recorded!",
  questions: [
    {
      id: 1,
      number: "01",
      question: "Who is secretly the CEO of making absolutely no sense but somehow making every conversation entertaining? 😭😂",
      shortLabel: "CEO of entertaining conversations",
      options: {
        commander: {
          id: "commander",
          label: "Commander",
          subtitle: "Supreme Command privilege",
          badge: "Comedy Department CEO",
          responses: [
            "Obviously Commander! Even her jokes come with their own entertainment package! 😂",
            "100% Commander! The delivery is only halfway through, but the giggles are already running at maximum capacity! 🤣",
            "Commander takes the gold medal! The comedy show begins before the sentence even ends! 😂"
          ]
        },
        me: {
          id: "me",
          label: "Me",
          subtitle: "Guilty as charged?",
          badge: "The Innocent Listener",
          responses: [
            "Aww, look at you taking responsibility! But Commander still owns the comedy department! 🤣",
            "He was just trying to be polite and innocent! Commander is the real laugh champion! 😂",
            "Nice try taking the blame! But official records confirm Commander holds the comedy crown 100%! 👑"
          ]
        }
      }
    },
    {
      id: 2,
      number: "02",
      question: "Who is more likely to laugh at a random thought and then struggle to explain why it's funny? 🤣",
      shortLabel: "Laughing at random thought",
      options: {
        commander: {
          id: "commander",
          label: "Commander",
          subtitle: "100 tabs open at once",
          badge: "Mach-5 Brain Engine",
          responses: [
            "Commander has 100 tabs open in her brain, and every single one is interesting! 😂",
            "Commander's thoughts move faster than high-speed internet! A 10/10 tactical reset! 🚀",
            "Not forgotten—just classified as Top Secret mid-sentence by the Commander herself! 🤣"
          ]
        },
        me: {
          id: "me",
          label: "Me",
          subtitle: "Just listening carefully",
          badge: "Patient Bystander",
          responses: [
            "He was just listening carefully! Commander is the one keeping the conversation exciting! 😇",
            "He was sitting there being a quiet, well-behaved listener while Commander took us on a scenic brain-detour! 😂",
            "Look at you being sweet and taking the rap! But Commander is definitely the master of the mid-sentence cliffhanger! 🤣"
          ]
        }
      }
    },
    {
      id: 3,
      number: "03",
      question: "Who deserves the award for being the most unpredictable human ever? 🏆",
      shortLabel: "Unpredictable human award",
      options: {
        commander: {
          id: "commander",
          label: "Commander",
          subtitle: "Supreme Chaos & Charm",
          badge: "Grand Champion of Chaos",
          responses: [
            "The award goes to Commander! Predictability has officially resigned! 🏆",
            "Supreme Unpredictable Legend! NASA radar couldn't calculate Commander's next move if they tried! 🌟",
            "Unanimous decree: Commander turns being unpredictable into an Olympic art form! 🏆"
          ]
        },
        me: {
          id: "me",
          label: "Me",
          subtitle: "Trying to be diplomatic",
          badge: "Sensible Supporter",
          responses: [
            "He tried to be diplomatic, but we all know Commander deserves that trophy! 😂",
            "He's just an innocent spectator in this universe! The grand trophy belongs strictly to Commander! 🏆",
            "You trying to steal the chaos crown? Not on this website! Commander wins this award 10 times out of 10! 🤣"
          ]
        }
      }
    },
    {
      id: 4,
      number: "04",
      question: "Who is more likely to make a simple decision feel like a national-level crisis? 😭",
      shortLabel: "National-level crisis decision",
      options: {
        commander: {
          id: "commander",
          label: "Commander",
          subtitle: "Premium Entertainment",
          badge: "Blockbuster Director",
          responses: [
            "Commander doesn't create drama. She creates premium entertainment! 🎬",
            "A 5-alarm tactical crisis over what snack to pick? Classic Commander perfection! 😭",
            "Every minor decision gets the full Hollywood blockbuster treatment! Absolutely iconic Commander energy! 🍿"
          ]
        },
        me: {
          id: "me",
          label: "Me",
          subtitle: "Keeping the peace",
          badge: "Chief Peacekeeper",
          responses: [
            "He's just trying to keep the peace. Commander makes even tiny decisions memorable! 😭",
            "He was ready with a calm, sensible answer... while Commander turned it into an international diplomatic summit! 🤣",
            "He's just an innocent bystander trying not to push the wrong button! Commander takes the drama award with honors! 🎬"
          ]
        }
      }
    },
    {
      id: 5,
      number: "05",
      question: "Who is more likely to turn a normal day into a completely unexpected adventure? 🤣",
      shortLabel: "Unexpected adventure generator",
      options: {
        commander: {
          id: "commander",
          label: "Commander",
          subtitle: "Chief Adventure Officer",
          badge: "Chief Adventure Officer",
          responses: [
            "Commander can turn an ordinary day into a legendary story! ✨",
            "Commander's presence automatically upgrades a boring Tuesday into an epic blockbuster side-quest! 🚀",
            "Chief Adventure Officer badge permanently pinned to Commander! Never a dull moment in 100 days! 🏆"
          ]
        },
        me: {
          id: "me",
          label: "Me",
          subtitle: "Minding his business",
          badge: "Peaceful Passenger",
          responses: [
            "He was peacefully minding his own business... then Commander made life interesting! 😂",
            "He was just being a calm, sensible boy... and then Commander said 'hear me out' and reality changed! 🤣",
            "He thought it was going to be a normal quiet day. Commander had other plans. Best plans ever! ✨"
          ]
        }
      }
    }
  ],
  finalVerdict: {
    badge: "OFFICIAL VERDICT 🏆",
    title: "Commander wins all five rounds!",
    subtext: "And he? He was just here being a good boy and supporting the champion. 😂",
    quote: "“Some people win awards. Some people make the whole experience worth remembering. That's Commander!”",
    rank: "UNDISPUTED 5-STAR SQUADRON CHAMPION"
  }
};
