
export interface SlangTerm {
  term: string;
  definition: string;
  example: string;
  tags: string[];
}

// Simulated data from shonaslang.com
export const SLANG_DATABASE: SlangTerm[] = [
  {
    term: "Bho / Bho zvekuti",
    definition: "Good, fine, excellent. The most common response to 'Ndeipi'.",
    example: "Zviri kufamba bho here? (Is everything going well?)",
    tags: ["Common", "Greeting"]
  },
  {
    term: "Ndeipi",
    definition: "What's up? / How are you? The standard slang greeting.",
    example: "Ndeipi wangu? (What's up my friend?)",
    tags: ["Greeting"]
  },
  {
    term: "Mbinga",
    definition: "A very rich person. Someone who flashes money.",
    example: "Uyo imbinga, anofamba neG-Wagon. (That guy is rich, he drives a G-Wagon.)",
    tags: ["Money", "Status"]
  },
  {
    term: "Wangu",
    definition: "My friend / My guy. Literally means 'Mine'.",
    example: "Taura wangu. (Speak, my friend.)",
    tags: ["People"]
  },
  {
    term: "Mudhara / Mdara",
    definition: "Literally 'Old man', but used respectfully for any male friend.",
    example: "Mdara, ndeipi? (Big man, what's up?)",
    tags: ["People", "Respect"]
  },
  {
    term: "Ghetto Yut",
    definition: "A young person from the high-density suburbs (Ghetto).",
    example: "MaGhetto Yut arikushanda nesimba. (The ghetto youths are working hard.)",
    tags: ["People"]
  },
  {
    term: "Salad",
    definition: "Someone from the wealthy low-density suburbs (Borrowdale, etc). Usually speaks English more than Shona.",
    example: "Uyo isalad, haanzwisise slang. (That one is a 'salad', they don't understand slang.)",
    tags: ["People", "Stereotype"]
  },
  {
    term: "Kupisa",
    definition: "Literally 'To burn', but means to be hot, trending, or very good.",
    example: "Ngoma iyi irikupisa! (This song is hot!)",
    tags: ["Vibe"]
  },
  {
    term: "Dhololo",
    definition: "Nothing, zero, failure.",
    example: "Ndakaenda kubasa asi ndakawana dhololo. (I went to work but got nothing.)",
    tags: ["Exclamation"]
  },
  {
    term: "Zhet",
    definition: "Okay, inside, deep. Often means 'It is well' or 'I am in'.",
    example: "Zviri zhet. (It is okay.)",
    tags: ["Common"]
  },
  {
    term: "Chigunduru",
    definition: "A homeless person or someone who sleeps rough.",
    example: "Usarare panze sechigunduru. (Don't sleep outside like a homeless person.)",
    tags: ["Insult/Descriptive"]
  },
  {
    term: "Kuseta",
    definition: "To hustle / To work hard.",
    example: "Tirikuda kuseta mari. (We want to hustle for money.)",
    tags: ["Work"]
  },
  {
    term: "Mushe",
    definition: "Nice, good, well.",
    example: "Zviri mushe. (It is nice.)",
    tags: ["Common"]
  },
  {
    term: "Ka1",
    definition: "Once / Simple / One time.",
    example: "Baya ka1. (Go once/Leave immediately.)",
    tags: ["Command"]
  },
  {
    term: "Dhiri",
    definition: "A deal, a plan, or an arrangement.",
    example: "Pane dhiri riripo here? (Is there a deal available?)",
    tags: ["Business"]
  },
  {
    term: "Hwahwa",
    definition: "Beer / Alcohol.",
    example: "Tirikunwa hwahwa. (We are drinking beer.)",
    tags: ["Party"]
  },
  {
    term: "Mutsigo",
    definition: "A load, burden, or luggage. Can refer to a problem.",
    example: "Ndine mutsigo wemari. (I have a burden/issue of money.)",
    tags: ["Nouns"]
  },
  {
    term: "Gaza",
    definition: "To eat / food.",
    example: "Handei tonogaza. (Let's go eat.)",
    tags: ["Action"]
  }
];
