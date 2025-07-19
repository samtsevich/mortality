import { Action, ActionPanel, Detail } from "@raycast/api";
import { useState } from "react";

const mementoMoriQuotes = [
  {
    quote: "Remember you must die.",
    author: "Ancient Roman Saying",
    context:
      "The classic memento mori reminder that death is inevitable and should motivate us to live fully.",
  },
  {
    quote:
      "Death is not the greatest loss in life. The greatest loss is what dies inside us while we live.",
    author: "Norman Cousins",
    context:
      "A reminder that spiritual and emotional death can happen long before physical death.",
  },
  {
    quote:
      "The fear of death follows from the fear of life. A man who lives fully is prepared to die at any time.",
    author: "Mark Twain",
    context:
      "Living authentically removes the fear of death because we've truly lived.",
  },
  {
    quote:
      "It is not death that a man should fear, but never beginning to live.",
    author: "Marcus Aurelius",
    context:
      "The Stoic emperor reminds us that an unlived life is worse than death itself.",
  },
  {
    quote:
      "You could die today. Let this determine what you do and say and think.",
    author: "Marcus Aurelius",
    context:
      "Use mortality as a guide for making better decisions in the present moment.",
  },
  {
    quote: "Death smiles at us all, but all a man can do is smile back.",
    author: "Marcus Aurelius",
    context: "Accept death with grace and dignity, facing it without fear.",
  },
  {
    quote: "Every new beginning comes from some other beginning's end.",
    author: "Seneca",
    context:
      "Death and endings are natural parts of life's cycle, making room for new growth.",
  },
  {
    quote: "Life is long enough if you know how to use it.",
    author: "Seneca",
    context:
      "The quality of time matters more than the quantity - use your time wisely.",
  },
  {
    quote: "We suffer more in imagination than in reality.",
    author: "Seneca",
    context:
      "Don't let fear of death prevent you from living - most of our suffering is mental.",
  },
  {
    quote: "Memento vivere - Remember to live.",
    author: "Latin Phrase",
    context:
      "The counterpart to memento mori - don't just remember death, remember to truly live.",
  },
  {
    quote:
      "The time you have left is short. Live as if you were living a second time.",
    author: "Viktor Frankl",
    context:
      "Approach each day as if you've been given a second chance at life.",
  },
  {
    quote:
      "In the end, it's not the years in your life that count. It's the life in your years.",
    author: "Abraham Lincoln",
    context: "Quality of experience matters more than longevity.",
  },
  {
    quote:
      "Time is the most valuable thing we have, because it is the most irrevocable.",
    author: "Dietrich Bonhoeffer",
    context: "Once time passes, it cannot be recovered - use it intentionally.",
  },
  {
    quote: "The good life is one inspired by love and guided by knowledge.",
    author: "Bertrand Russell",
    context:
      "Live with both heart and wisdom to make your finite time meaningful.",
  },
  {
    quote:
      "What we plant in the soil of contemplation, we shall reap in the harvest of action.",
    author: "Meister Eckhart",
    context: "Reflecting on mortality should inspire better actions in life.",
  },
  {
    quote: "Yesterday is history, tomorrow is a mystery, today is a gift.",
    author: "Eleanor Roosevelt",
    context: "Focus on the present moment - it's the only time you truly have.",
  },
  {
    quote: "The meaning of life is to give life meaning.",
    author: "Viktor Frankl",
    context:
      "Create purpose in your finite existence through your choices and actions.",
  },
  {
    quote: "We are here to drink from the cup of life, not to sip it.",
    author: "Paulo Coelho",
    context: "Live fully and intensely rather than holding back out of fear.",
  },
  {
    quote: "Death is the destination we all share. No one has ever escaped it.",
    author: "Steve Jobs",
    context:
      "Accepting our shared mortality can help us focus on what truly matters.",
  },
  {
    quote: "Your time is limited, don't waste it living someone else's life.",
    author: "Steve Jobs",
    context:
      "Use your finite time authentically, not trying to please others or meet their expectations.",
  },
  {
    quote: "The graveyards are full of indispensable men.",
    author: "Charles de Gaulle",
    context:
      "No one is irreplaceable - focus on living well rather than being important.",
  },
  {
    quote: "Life is what happens while you're busy making other plans.",
    author: "John Lennon",
    context: "Don't postpone living while planning for the future.",
  },
  {
    quote:
      "The only way to deal with death is to transform everything that precedes it into art.",
    author: "Jean-Paul Sartre",
    context: "Make your life a work of art through conscious, creative living.",
  },
  {
    quote:
      "Death is not extinguishing the light; it is only putting out the lamp because the dawn has come.",
    author: "Rabindranath Tagore",
    context: "View death as a transition rather than an ending.",
  },
  {
    quote:
      "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi",
    context: "Balance urgency in living with patience in learning and growing.",
  },
];

const motivationalMessages = [
  {
    message: "Today you have 1,440 minutes. How will you invest them?",
    theme: "Time Investment",
  },
  {
    message:
      "Every sunrise is a reminder that you've been given another chance to make a difference.",
    theme: "New Beginnings",
  },
  {
    message: "Your life is not a dress rehearsal. This is it - make it count.",
    theme: "Authenticity",
  },
  {
    message:
      "The clock is ticking, but you're still here. What will you create today?",
    theme: "Creation",
  },
  {
    message: "Time spent in worry is time stolen from joy. Choose wisely.",
    theme: "Mindfulness",
  },
  {
    message:
      "You have exactly the same number of hours per day as everyone who ever accomplished anything great.",
    theme: "Equality of Time",
  },
  {
    message: "Your future self is counting on the decisions you make today.",
    theme: "Future Impact",
  },
  {
    message:
      "Every moment you're alive is a moment someone else will never have. Honor it.",
    theme: "Gratitude",
  },
  {
    message:
      "The best time to plant a tree was 20 years ago. The second best time is now.",
    theme: "Starting Now",
  },
  {
    message:
      "Your mortality is not a limitation - it's what makes every moment precious.",
    theme: "Preciousness",
  },
];

function getRandomQuote() {
  const allContent = [...mementoMoriQuotes, ...motivationalMessages];
  return allContent[Math.floor(Math.random() * allContent.length)];
}

function getDailyQuote() {
  // Use date as seed for consistent daily quote
  const today = new Date().toDateString();
  const seed = today.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
  const allContent = [...mementoMoriQuotes, ...motivationalMessages];
  return allContent[seed % allContent.length];
}

export default function Command() {
  const [currentContent, setCurrentContent] = useState(getDailyQuote());
  const [isDaily, setIsDaily] = useState(true);

  const isQuote = "author" in currentContent;
  const today = new Date().toLocaleDateString("en-GB");

  const markdown = `
# ${isDaily ? "Daily" : "Random"} Inspiration

## ${today}

${
  isQuote
    ? `
> "${(currentContent as unknown as { quote: string; author: string; context: string }).quote}"

**— ${(currentContent as unknown as { quote: string; author: string; context: string }).author}**

### Context
${(currentContent as unknown as { quote: string; author: string; context: string }).context}
`
    : `
### ${(currentContent as unknown as { theme: string; message: string }).theme}

${(currentContent as unknown as { theme: string; message: string }).message}
`
}

---

### Memento Mori Reflection

Take a moment to reflect on this message. How does it apply to your life today? What action will you take because of this reminder?

**Remember:** You have a finite number of days, hours, and moments. Each one is irreplaceable and precious.

**Today's Challenge:** Choose one thing you've been postponing and take the first step toward it.

---

*"The goal is not to live forever, but to create something that will."* - Chuck Palahniuk
  `;

  return (
    <Detail
      markdown={markdown}
      actions={
        <ActionPanel>
          <Action
            title="New Random Quote"
            onAction={() => {
              setCurrentContent(getRandomQuote());
              setIsDaily(false);
            }}
          />
          <Action
            title="Today's Quote"
            onAction={() => {
              setCurrentContent(getDailyQuote());
              setIsDaily(true);
            }}
          />
          <Action
            title="Refresh"
            onAction={() => {
              if (isDaily) {
                setCurrentContent(getDailyQuote());
              } else {
                setCurrentContent(getRandomQuote());
              }
            }}
          />
        </ActionPanel>
      }
    />
  );
}
