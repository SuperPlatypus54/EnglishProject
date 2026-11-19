export interface HeartlineProfile {
  id: string;
  name: string;
  age: number;
  occupation?: string;
  height?: string;
  bio: string;
  interests: readonly string[];
  avatarColor: "rose" | "ink";
}

export interface HeartlineMessage {
  sender: "james" | "match";
  time: string;
  text: string;
}

export interface HeartlineThread {
  id: string;
  personId: string;
  date: string;
  preview: string;
  unread?: boolean;
  messages: readonly HeartlineMessage[];
}

export const heartlineProfiles: readonly HeartlineProfile[] = [
  {
    id: "james",
    name: "James Bond",
    age: 28,
    occupation: "Sales Associate",
    bio: "Just a guy looking for someone to make life a little less boring. Big fan of fancy dinners and good conversations.",
    interests: ["Fine dining", "Sunday walks", "A long-term relationship"],
    avatarColor: "ink",
  },
  {
    id: "sydney",
    name: "Sydney",
    age: 26,
    height: "6′5″",
    bio: "Looking for someone who can match my energy. When I find someone I like, I go all in.",
    interests: ["Weightlifting", "Fitness", "Fine dining", "Quality time"],
    avatarColor: "rose",
  },
];

export const heartlineThreads: readonly HeartlineThread[] = [
  {
    id: "sydney",
    personId: "sydney",
    date: "2026-11-17",
    preview: "Me too. Seriously :)",
    unread: true,
    messages: [
      { sender: "match", time: "3:02 PM", text: "Oh hey. I was hoping you'd match back." },
      { sender: "james", time: "3:04 PM", text: "Hi! I almost closed the app before I saw the notification lol" },
      { sender: "match", time: "3:04 PM", text: "Lucky me then. How's your Tuesday?" },
      { sender: "james", time: "3:05 PM", text: "Slow. At work pretending my coffee is still warm. You?" },
      { sender: "match", time: "3:05 PM", text: "Just got out of the gym. I hit a new deadlift PR and have nobody to tell so congratulations, it's you" },
      { sender: "james", time: "3:06 PM", text: "Okay genuinely impressive. The heaviest thing I lift most days is a laptop." },
      { sender: "match", time: "3:06 PM", text: "I'll take you lifting sometime. What's your thing outside work?" },
      { sender: "james", time: "3:07 PM", text: "A good dinner. Somewhere you can actually hear each other talk." },
      { sender: "match", time: "3:07 PM", text: "That's exactly what I put in my profile. Were you paying attention?" },
      { sender: "james", time: "3:08 PM", text: "I may have read it twice." },
      { sender: "match", time: "3:08 PM", text: "Good. You're very cute when you're trying to play it cool btw" },
      { sender: "james", time: "3:09 PM", text: "That obvious huh" },
      { sender: "match", time: "3:10 PM", text: "A little :) Do you have a favorite restaurant around here?" },
      { sender: "james", time: "3:10 PM", text: "I live at The Grand Meridian. There's a fancy place downstairs I've been meaning to take someone to." },
      { sender: "match", time: "3:11 PM", text: "The one with the brass doors? I walk past it all the time. I didn't know people lived there." },
      { sender: "james", time: "3:11 PM", text: "Yeah, offices upstairs and then apartments. I'm in 402." },
      { sender: "match", time: "3:12 PM", text: "How do you get up there from the restaurant? It just looks like one big lobby." },
      { sender: "james", time: "3:12 PM", text: "Elevator past the front desk. I can meet you by the restaurant doors though." },
      { sender: "match", time: "3:13 PM", text: "Wait are you asking me out" },
      { sender: "james", time: "3:13 PM", text: "Trying to. Dinner tomorrow? 7?" },
      { sender: "match", time: "3:13 PM", text: "YES" },
      { sender: "match", time: "3:14 PM", text: "I mean yes, that works for me." },
      { sender: "james", time: "3:15 PM", text: "Good. I was more nervous to send that than I thought I'd be." },
      { sender: "match", time: "3:15 PM", text: "Don't be. You're handsome and you're funny and you actually ask me questions. The bar is low but you're way over it." },
      { sender: "match", time: "3:16 PM", text: "If tomorrow goes how I think it will, next week we can go back to the gym together. Then it's my turn to pick dinner." },
      { sender: "james", time: "3:17 PM", text: "We've got a second date and a training schedule already? Moving a little fast there haha" },
      { sender: "match", time: "3:17 PM", text: "Once I find someone I really like, I don't let them get away that easily." },
      { sender: "james", time: "3:18 PM", text: "Haha, you're making me nervous already." },
      { sender: "match", time: "3:18 PM", text: "Good nervous, I hope :)" },
      { sender: "james", time: "3:19 PM", text: "Let's just see how dinner goes first." },
      { sender: "match", time: "3:20 PM", text: "Of course. I got excited. Sorry if that was a lot." },
      { sender: "james", time: "3:23 PM", text: "Just booked it. Wednesday, Nov 18, 7 pm. Table for two under Bond." },
      { sender: "match", time: "3:23 PM", text: "I'll be there a few minutes early. Brass doors by the lobby, right?" },
      { sender: "james", time: "3:24 PM", text: "Yep. Looking forward to it." },
      { sender: "match", time: "3:24 PM", text: "Me too. Seriously :)" },
    ],
  },
];
