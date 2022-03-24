import * as React from "react";
// @ts-ignore
import { DiscordMention, DiscordMessage, DiscordMessages } from "@skyra/discord-components-react";
import { sample } from "../../utils/array";

// declare global {
// 	interface Window {
// 		$discordMessage: DiscordMessageOptions;
// 	}
// }

window.$discordMessage = {
    profiles: {
        langame: {
            author: "Langame",
            avatar: require("../../assets/images/logo-white.png"),
            bot: true,
            verified: true,
            roleColor: "#1e88e5"
        },
        lou03: {
            author: "Lou",
            avatar: "https://github.com/favna.png",
            bot: false,
            verified: true,
            roleColor: "lightgreen"
        },
        huy66: {
            author: "Huy",
            avatar: "https://github.com/NM-EEA-Y.png",
            bot: false,
            verified: true,
            roleColor: "lightgreen"
        },
        alice76: {
            author: "Alice",
            avatar: "red",
            bot: false,
            verified: true,
            roleColor: "lightgreen"
        },
    }
};

const langames = [
    {
        "question": {
            "topics": ["ice breaker"],
            "players": [
                "huy66", "alice76", "lou03"
            ],
            "conversationStarter": "What are some of the best / worst Christmas gifts you've ever gotten?",
        },
        "answers": [
            {
                "profile": "lou03",
                "answer": "The best Christmas gifts that have been given to me so far is an Ethereum! The worst one was toothpaste. I don't know why my friend gave me that 😔?",
            }
        ],
    },
    {
        "question": {
            "topics": ["ice breaker"],
            "players": [
                "huy66", "lou03"
            ],
            "conversationStarter": "What's something you're really curious about?",
        },
        "answers": [
            {
                "profile": "huy66",
                "answer": "I love astronomy, when I was 12 I wanted to become an astronaut!",
            }
        ],
    },
    {
        "question": {
            "topics": ["big talk"],
            "players": [
                "huy66", "alice76", "lou03"
            ],
            "conversationStarter": "What do you want to do before you die?",
        },
        "answers": [
            {
                "profile": "alice76",
                "answer": "I want to spread happiness to everyone 🥰",
            },
            {
                "profile": "langame",
                "answer": "You are a wonderful person, Alice.",
            }
        ],
    },
    {
        "question": {
            "topics": ["travel"],
            "players": [
                "huy66", "alice76", "lou03"
            ],
            "conversationStarter": "What's something you learned while traveling?",
        },
        "answers": [
            {
                "profile": "alice76",
                "answer": "I learned that the best way to learn something is by doing it 😇.",
            }
        ],
    },
    {
        "question": {
            "topics": ["health"],
            "players": [
                "huy66", "alice76", "lou03"
            ],
            "conversationStarter": "What's something really simple that has given you a lot of health?",
        },
        "answers": [
            {
                "profile": "alice76",
                "answer": "I think eating a lot of vegetables is the best way to get a good night's sleep.",
            }
        ],
    },
    {
        "question": {
            "topics": ["health"],
            "players": [
                "huy66", "alice76", "lou03"
            ],
            "conversationStarter": "Which is better: dieting or exercising? Why??",
        },
        "answers": [
            {
                "profile": "lou03",
                "answer": "I don't know, I can do neither of them 😂",
            }
        ],
    },
    {
        "question": {
            "topics": ["dating"],
            "players": [
                "huy66", "alice76",
            ],
            "conversationStarter": "Describe in details your most awkward date.",
        },
        "answers": [
            {
                "profile": "huy66",
                "answer": "Ok. I start. This is going to be a long anwser 😅",
            },
            {
                "profile": "langame",
                "answer": "Don't worry, we have plenty of time to listen to you 😛",
            }
        ],
    },
    {
        "question": {
            "topics": ["personal development"],
            "players": [
                "lou03", "alice76",
            ],
            "conversationStarter": "What tricks do you use to stick to your habits? Any concrete examples?",
        },
        "answers": [
            {
                "profile": "alice76",
                "answer": "I read in Atomic Habits that announcing our objective publicly increase our incentive to stick to it 🤓.",
            },
            {
                "profile": "langame",
                "answer": "Did you do it? What's your progression on this objective?",
            }
        ],
    },
    {
        "question": {
            "topics": ["big talk"],
            "players": [
                "lou03", "alice76", "huy66",
            ],
            "conversationStarter": "What are the top three goals of your life? How are you achieving these?",
        },
        "answers": [
            {
                "profile": "huy66",
                "answer": "I want to be the best father and husband, I read many books on this! I also wish to get a raise in my job, I'm trying to learn new things during my week-ends.",
            },
        ],
    }
]

const DiscordSamples = (
    { style }: React.PropsWithChildren<{ style?: React.CSSProperties }>
) => {
    const langame = React.useState(sample(langames))[0];
    return (
        <DiscordMessages
            style={style}
        >
            <DiscordMessage
                profile="langame"
            >
                Topics: {langame.question.topics.join(",")}<br />
                Players: {langame.question.players.map((p) => {
                    return (
                        <DiscordMention key={p}>{p}</DiscordMention>
                    );
                })}<br /><br />
                <strong>{langame.question.conversationStarter}</strong>
            </DiscordMessage>
            {langame.answers.map((answer, index) => {
                return (
                    <DiscordMessage
                        key={index}
                        profile={answer.profile}
                    >
                        {answer.answer}
                    </DiscordMessage>
                );
            })}
        </DiscordMessages>
    );
}

export default DiscordSamples;
