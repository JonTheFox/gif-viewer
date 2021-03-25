import DURATIONS from "./durations.js";

const COLORS = {
	primary: "rgba(148, 116, 204, 1)",
	secondary: "rgba(68, 221, 238, 1)",
	black: "rgba(0, 0, 0, 1)",
	white: "rgba(255, 255, 255, 1)",
	canvas: "rgba(224, 224, 224, 1)",
};

const BASE_POSES = {
	//NOTE: By itself, BASE_POSES won't animate anything. Spread Its objects AND THEN add a property to animate, such as opacity, x, rotateX, and so on.
	enter: {
		afterChildren: true,
		// delayChildren: 0,
		// delay: 0,
		transition: { duration: DURATIONS.enter }, //used to be 200}

		delay: 0,
	},
	exit: {
		afterChildren: true,
		// delay: DURATIONS.exit * 0.5,
		// delayChildren: 0,
		transition: { duration: DURATIONS.exit }, //used to be 200
	},
};
const POSES = {
	draggable: {
		draggable: true,
		dragEnd: { x: 0, y: 0, transition: "spring" }, //spring back to original position
	},
	word__draggable: {
		draggable: true,
		dragEnd: { x: 0, y: 0, transition: "spring" }, //spring back to original position,
	},
	word__draggable__remain: {
		draggable: true,
		// dragEnd: { x: 0, y: 0, transition: "spring" }
	},
	char__draggable: {
		drag: {
			y: 0,
			transition: ({ charInWordIndex }) => ({
				type: "spring",
				velocity: 100 * Math.sin(1 + charInWordIndex),
				damping: 0,
			}),
		},
		dragEnd: {
			y: 0,
			x: 0,
			transition: {
				type: "spring",
				damping: 10,
				stiffness: 1000,
			},
		},
	},
	char__draggable__appear: {
		exit: {
			opacity: 0,

			color: COLORS.white,
			transition: ({
				wordIndex,
				numWords,
				charIndex,
				numChars,
				charInWordIndex,
				numCharsInWord,
			}) => ({
				duration: DURATIONS.enter * 0.25,
			}),
		},

		enter: {
			opacity: 1,

			color: COLORS.black,
			backgroundColor: ({ wordIndex, numWords }) =>
				`rgba(255,255,255,${wordIndex === numWords - 1 ? 1 : 0})`,
			delay: ({ wordIndex, numWords, charIndex, speechRate }) =>
				(wordIndex === 0 ? 1.25 : numWords === wordIndex + 1 ? 1 : 1) *
				(450 * (1 - speechRate) +
					wordIndex * 8 * 30 * (wordIndex >= numWords - 1 ? 1.1 : 1)),
			transition: ({
				wordIndex,
				numWords,
				charIndex,
				numChars,
				charInWordIndex,
				numCharsInWord,
			}) => ({
				duration: DURATIONS.enter,
			}),
		},
		drag: {
			y: 0,
			opacity: 1,
			transition: ({ charInWordIndex }) => ({
				type: "spring",
				velocity: 100 * Math.sin(1 + charInWordIndex),
				damping: 0,
			}),
		},
		dragEnd: {
			y: 0,
			x: 0,
			opacity: 1,
			transition: {
				type: "spring",
				damping: 10,
				stiffness: 1000,
			},
		},
	},
	char__wobbling: {
		enter: {
			y: 0,
			transition: ({ charInWordIndex }) => ({
				type: "spring",
				velocity: 100 * Math.sin(1 + charInWordIndex),
				damping: 0,
			}),
		},
		drag: {
			y: 0,
			transition: ({ charInWordIndex }) => ({
				type: "spring",
				velocity: 100 * Math.sin(1 + charInWordIndex),
				damping: 0,
			}),
		},
		dragEnd: {
			y: 0,
			transition: ({ charInWordIndex }) => ({
				type: "spring",
				velocity: 100 * Math.sin(1 + charInWordIndex),
				damping: 0,
			}),
		},
	},
	char: {
		exit: {
			opacity: 0,
			color: COLORS.secondary,
			transition: ({
				wordIndex,
				numWords,
				charIndex,
				numChars,
				charInWordIndex,
				numCharsInWord,
			}) => ({
				duration: DURATIONS.enter,
			}),
		},

		enter: {
			opacity: 1,
			color: COLORS.black,
			backgroundColor: ({ wordIndex, numWords }) =>
				`rgba(255,255,255,${wordIndex === numWords - 1 ? 1 : 0})`,
			delay: ({ wordIndex, numWords, charIndex }) =>
				wordIndex * 220 * (wordIndex >= numWords - 1 ? 1.1 : 1) +
				charIndex * 30,
			transition: ({
				wordIndex,
				numWords,
				charIndex,
				numChars,
				charInWordIndex,
				numCharsInWord,
			}) => ({
				duration: DURATIONS.enter,
			}),
		},
	},
	char__stagger: {
		exit: {
			// opacity: 0,
			color: COLORS.primary,
			transition: ({
				wordIndex,
				numWords,
				charIndex,
				numChars,
				charInWordIndex,
				numCharsInWord,
			}) => ({
				duration: DURATIONS.enter,
			}),
		},

		enter: {
			// opacity: 1,
			color: COLORS.black,
			delay: ({ wordIndex, numWords, charIndex }) =>
				charIndex * DURATIONS.enter * 0.25,
			transition: ({
				wordIndex,
				numWords,
				charIndex,
				numChars,
				charInWordIndex,
				numCharsInWord,
			}) => ({
				duration: DURATIONS.enter,
			}),
		},
	},
	char_fadeIn__old: {
		exit: {
			opacity: 0,
			// scale: ({ wordIndex, numWords, charIndex, speechRate }) =>
			// 	wordIndex + 1 === numWords ? 4 : 0,
			// color: COLORS.white,
			transition: ({
				wordIndex,
				numWords,
				charIndex,
				numChars,
				charInWordIndex,
				numCharsInWord,
			}) => ({
				duration: DURATIONS.enter * 0.5,
			}),
		},

		enter: {
			opacity: 1,
			// scale: 1,
			// color: COLORS.black,
			// backgroundColor: ({ wordIndex, numWords }) =>
			// 	`rgba(255,255,255,0})`,
			delay: 0,
			transition: ({
				wordIndex,
				numWords,
				charIndex,
				numChars,
				charInWordIndex,
				numCharsInWord,
				speechRate = 0.75,
			}) => ({
				duration: DURATIONS.enter,
			}),
		},
	},
	char_fadeIn: {
		exit: {
			opacity: 0,
			scale: ({ wordIndex, numWords, charIndex, speechRate }) =>
				wordIndex + 1 === numWords ? 4 : 0,
			// color: COLORS.white,
			transition: ({
				wordIndex,
				numWords,
				charIndex,
				numChars,
				charInWordIndex,
				numCharsInWord,
			}) => ({
				duration: DURATIONS.enter * 0.5,
			}),
		},

		enter: {
			opacity: 1,
			scale: 1,
			// color: COLORS.black,
			// backgroundColor: ({ wordIndex, numWords }) =>
			// 	`rgba(255,255,255,0})`,
			delay: ({ wordIndex, numWords, charIndex, speechRate }) =>
				(wordIndex === 0 ? 1 : numWords === wordIndex + 1 ? 1 : 1) *
				(DURATIONS.enter * (1 - speechRate) +
					wordIndex *
					8 * //9.25 for google uk female
						30 *
						(wordIndex >= numWords - 1 ? 1.05 : 1)),
			transition: ({
				wordIndex,
				numWords,
				charIndex,
				numChars,
				charInWordIndex,
				numCharsInWord,
				speechRate = 0.75,
			}) => ({
				duration:
					DURATIONS.enter * (1 - speechRate) +
					60 * (numWords === wordIndex + 1 ? 1.5 : 1),
			}),
		},
	},

	char_fadeIn_sentence: {
		exit: {
			opacity: 0,
			x: "-2rem",
			skew: "45deg",
			// color: ({ exitColor = COLORS.black }) => exitColor,
			transition: ({
				wordIndex,
				numWords,
				charIndex,
				numChars,
				charInWordIndex,
				numCharsInWord,
			}) => ({
				duration: DURATIONS.exit,
			}),
		},

		enter: {
			opacity: 1,
			x: "0rem",
			skew: "0deg",
			// color: ({ enterColor = COLORS.white }) => enterColor,
			delay: ({
				wordIndex,
				numWords,
				charIndex,
				speechRate,
				delayPerWord = DURATIONS.enter * 0.1,
			}) => wordIndex * delayPerWord,
			transition: ({
				wordIndex,
				numWords,
				charIndex,
				numChars,
				charInWordIndex,
				numCharsInWord,
				appearDuration = DURATIONS.enter,
			}) => ({
				duration: appearDuration,
				type: "spring",
				mass: 0.5,
			}),
		},
		drag: {
			y: 0,
			transition: ({ charInWordIndex }) => ({
				type: "spring",
				velocity: 75 * Math.sin(1 + charInWordIndex),
				damping: 0,
			}),
			// background: "rgba(257, 20, 0, 0)"
		},
		dragEnd: {
			y: 0,
			x: 0,
			transition: {
				type: "spring",
				damping: 10,
				stiffness: 1000,
			},
		},
	},

	list: {
		visible: {
			nothing: "0%", //to animate children
			staggerChildren: ({ round = 0, numAnswers = 4, overallStep = 0 }) =>
				round === 0
					? DURATIONS.enter + DURATIONS.freeze
					: Math.max(
							50,
							DURATIONS.enter -
								(overallStep + 1) * 30 * numAnswers
					  ),
			staggerDirection: -1,
		},
		hidden: {
			nothing: "100%",
			staggerChildren: ({ round = 0, overallStep = 0, numAnswers = 2 }) =>
				100 ||
				Math.max(100, DURATIONS.exit - overallStep * numAnswers * 5),
			staggerDirection: 1,
		},
		props: { step: 0, round: 0, numAnswers: 4 },
	},
	list__grid: {
		visible: {
			nothing: "0%", //to animate children
			staggerChildren: ({ round = 0, numAnswers = 4, overallStep = 0 }) =>
				round === 0
					? DURATIONS.enter + DURATIONS.freeze
					: Math.max(
							50,
							DURATIONS.enter -
								(overallStep + 1) * 30 * numAnswers
					  ),
			staggerDirection: -1,
		},
		hidden: {
			nothing: "100%",
			staggerChildren: ({ round = 0, overallStep = 0, numAnswers = 2 }) =>
				Math.max(100, DURATIONS.exit - overallStep * numAnswers * 5),
			staggerDirection: 1,
		},
		props: { step: 0, round: 0, numAnswers: 4 },
	},
	view_main: {
		enter: {
			beforeChildren: true,
			delay: 0,
			transition: { duration: 1 },
		},
		exit: {
			afterChildren: false,
			delay: 0,
			transition: { duration: 1 },
		},
	},
	view: {
		// init: { rotateY: "180deg" },
		enter: {
			// rotateY: "0deg",
			// rotateX: "0deg",
			// scale: 1,
			// applyAtStart: { opacity: 0 },
			opacity: 1,
			// x: "0%",
			beforeChildren: true,
			// delay: DURATIONS.enter,
			delay: 0,
			delayChildren: DURATIONS.enter,
			flip: true,
			transition: { duration: DURATIONS.exit },
			//y: "0%"
		},
		exit: {
			opacity: 0,
			// scale: 0.9,
			// applyAtStart: { opacity: 0 },
			// rotateY: "90deg",
			// rotateX: "90deg",
			// x: "-100%",
			delay: 0,
			afterChildren: true,
			// flip: true,
			transition: { duration: DURATIONS.enter },
			// transition: { duration: DURATIONS.enter * 0.5},
			// beforeChildren: true

			//y: "100%"
		},
	},
	opacity: {
		enter: {
			...BASE_POSES.enter,
			opacity: 1,
		},
		exit: {
			...BASE_POSES.exit,
			opacity: 0,
		},
	},
	card: {
		hidden: {
			opacity: 0,
			scale: ({ i, step = 0, quizIsDone = false, round = 0 }) =>
				step === 0 ? 2.5 : 2,

			boxShadow: ({ i, step = 0, round = 0 }) =>
				//assuming 2 rows with 2 items in each
				`${i % 2 === 0 ? "32" : "-32"}px ${-24 *
					(step === 0 ? 1 : 0.2)}px ${
					i < 2 ? "24" : "24"
				}px rgba(${"68, 221, 238, 1"})`,
			x: ({ i, step = 0, round = 0 }) =>
				window.innerWidth *
				(i % 2 === 0 ? 1 : -1) *
				(step === 0 && round === 0 ? 0.75 : 2),

			y: ({ i, step = 0, round = 0 }) =>
				step === 0 && round === 0
					? window.innerHeight * -1 * (i < 2 ? 1.25 : 1.5)
					: 1,
			transition: ({ step = 0, round = 0 }) => ({
				delay: 0,
				duration:
					round === 0 && step === 0
						? DURATIONS.enter
						: DURATIONS.enter * 0.5,
				type: "spring",
				stiffness: step === 0 ? 15 : 10,
				mass: step === 0 ? 1 : 0.8,
				damping: step === 0 ? 20 : 5,
			}),
		},
		visible: {
			//enter and re-enter
			opacity: 1,
			scale: 1,
			boxShadow: ({ i, step = 0, round = 0 }) =>
				//assuming 2 rows with 2 items in each
				`${(step === 0 ? 8 : 1) *
					(i % 2 === 0 ? "1" : "-1")}px ${(step === 0 ? 1 : 0.2) *
					-4}px ${i < 2 ? "4" : "4"}px rgba(${"148, 116, 204, 0"})`,
			x: 0,
			y: 0,
			transition: ({
				i,
				delay = DURATIONS.enter,
				active,
				step = 0,
				round = 0,
			}) => ({
				delay: 0,
				duration:
					step > 0
						? 0
						: round === 0
						? DURATIONS.enter
						: DURATIONS.enter * 0.75,
				type: "spring",
				stiffness: step === 0 ? 30 : 25,
				mass: step === 0 ? 0.8 : 1,
				damping: step === 0 ? 12 : 100,
			}),
		},
		pressable: ({ active }) => active,
		press: {
			scale: ({ active }) => (active ? 0.9 : 1),
			transition: ({ i, active }) => ({
				//         delay: 800 + i * 1000,
				duration: active ? 25 : 0,
				delay: 0,
				//         type: "spring",
				//         stiffness: 70,
				mass: 1.5,
				//         damping: 12
			}),
		},
		props: {
			i: 0,
			step: 0,
			round: 0,
			quizIsDone: false,
			active: false,
			numAnswers: 2,
		},
	},
	card__grid: {
		hidden: {
			opacity: 0,
			transition: ({ i = 0 }) => ({
				delay: i * 100,
				duration: DURATIONS.exit,
				type: "spring",
				stiffness: 150,
				mass: 1,
				damping: 20,
			}),
		},
		visible: {
			//enter and re-enter
			opacity: 1,
			transition: ({ i = 0, numItems = 0 }) => ({
				delay: (numItems - i) * 100,
				duration: DURATIONS.enter,
				type: "spring",
				stiffness: 200,
				damping: 5,
			}),
		},
		pressable: ({ active }) => true,
		press: {
			scale: ({ active }) => (active ? 0.9 : 0.8),
			transition: ({ i, active }) => ({
				//         delay: 800 + i * 1000,
				duration: active ? 25 : 20,
				delay: 0,
				//         type: "spring",
				//         stiffness: 70,
				mass: 1.5,
				//         damping: 12
			}),
		},
	},
	card__pressable___sans_shadow: {
		hidden: {
			opacity: 0,
			scale: ({ i, step = 0, quizIsDone = false, round = 0 }) =>
				step === 0 ? 2.5 : 2,
			x: ({ i, step = 0, round = 0 }) =>
				window.innerWidth *
				(i % 2 === 0 ? 1 : -1) *
				(step === 0 && round === 0 ? 0.75 : 2),

			y: ({ i, step = 0, round = 0 }) =>
				step === 0 && round === 0
					? window.innerHeight * -1 * (i < 2 ? 1.25 : 1.5)
					: 1,
			transition: ({ step = 0, round = 0 }) => ({
				delay: 0,
				duration:
					round === 0 && step === 0
						? DURATIONS.enter
						: DURATIONS.enter * 0.5,
				type: "spring",
				stiffness: step === 0 ? 15 : 10,
				mass: step === 0 ? 1 : 0.8,
				damping: step === 0 ? 20 : 5,
			}),
		},
		visible: {
			//enter and re-enter
			opacity: 1,
			scale: 1,
			x: 0,
			y: 0,
			transition: ({
				i,
				delay = DURATIONS.enter,
				active,
				step = 0,
				round = 0,
			}) => ({
				delay: 0,
				duration:
					step > 0
						? 0
						: round === 0
						? DURATIONS.enter
						: DURATIONS.enter * 0.75,
				type: "spring",
				stiffness: step === 0 ? 30 : 25,
				mass: step === 0 ? 0.8 : 1,
				damping: step === 0 ? 12 : 100,
			}),
		},
		pressable: ({ active }) => active,
		press: {
			scale: ({ active }) => (active ? 0.9 : 1),
			transition: ({ i, active }) => ({
				//         delay: 800 + i * 1000,
				duration: active ? 50 : 0,
				delay: 0,
				//         type: "spring",
				stiffness: 25,
				mass: 1,
				damping: 100,
			}),
		},
		props: {
			i: 0,
			step: 0,
			round: 0,
			quizIsDone: false,
			active: false,
			numAnswers: 2,
		},
	},
	card__pressable: {
		hidden: {
			opacity: 0,
			scale: ({ i, step = 0, quizIsDone = false, round = 0 }) =>
				step === 0 ? 2.5 : 2,

			boxShadow: ({ i, step = 0, round = 0 }) =>
				//assuming 2 rows with 2 items in each
				`${i % 2 === 0 ? "32" : "-32"}px ${-24 *
					(step === 0 ? 1 : 0.2)}px ${
					i < 2 ? "24" : "24"
				}px rgba(${"68, 221, 238, 1"})`,
			x: ({ i, step = 0, round = 0 }) =>
				window.innerWidth *
				(i % 2 === 0 ? 1 : -1) *
				(step === 0 && round === 0 ? 0.75 : 2),

			y: ({ i, step = 0, round = 0 }) =>
				step === 0 && round === 0
					? window.innerHeight * -1 * (i < 2 ? 1.25 : 1.5)
					: 1,
			transition: ({ step = 0, round = 0 }) => ({
				delay: 0,
				duration:
					round === 0 && step === 0
						? DURATIONS.enter
						: DURATIONS.enter * 0.5,
				type: "spring",
				stiffness: step === 0 ? 15 : 10,
				mass: step === 0 ? 1 : 0.8,
				damping: step === 0 ? 20 : 5,
			}),
		},
		visible: {
			//enter and re-enter
			opacity: 1,
			scale: 1,
			boxShadow: ({ i, step = 0, round = 0 }) =>
				//assuming 2 rows with 2 items in each
				`${(step === 0 ? 8 : 1) *
					(i % 2 === 0 ? "1" : "-1")}px ${(step === 0 ? 1 : 0.2) *
					-4}px ${i < 2 ? "4" : "4"}px rgba(${"148, 116, 204, 0"})`,
			x: 0,
			y: 0,
			transition: ({
				i,
				delay = DURATIONS.enter,
				active,
				step = 0,
				round = 0,
			}) => ({
				delay: 0,
				duration:
					step > 0
						? 0
						: round === 0
						? DURATIONS.enter
						: DURATIONS.enter * 0.75,
				type: "spring",
				stiffness: step === 0 ? 30 : 25,
				mass: step === 0 ? 0.8 : 1,
				damping: step === 0 ? 12 : 100,
			}),
		},
		pressable: ({ active }) => active,
		press: {
			scale: ({ active }) => (active ? 0.9 : 1),
			transition: ({ i, active }) => ({
				//         delay: 800 + i * 1000,
				duration: active ? 50 : 0,
				delay: 0,
				//         type: "spring",
				stiffness: 25,
				mass: 1,
				damping: 100,
			}),
		},
		props: {
			i: 0,
			step: 0,
			round: 0,
			quizIsDone: false,
			active: false,
			numAnswers: 2,
		},
	},

	/*older poses*/
	fadeIn: {
		enter: {
			opacity: 1,
			delay: DURATIONS.exit,
			afterChildren: true,
			//delayChildren: 50,
			//staggerChildren: 300
			duration: DURATIONS.enter,
			// z: "0%",
			//scale: 1,
		},
		exit: {
			opacity: 0,
			// z: ({ isEntering }) => (isEntering ? "200%" : "-200%"),
			delay: 0,
			duration: DURATIONS.exit,
			afterChildren: true,
			//scale: 0,
		},
	},
	config1: {
		enter: {
			delay: 300,
			beforeChildren: 400,
			opacity: 1,
			duration: 400,
			// z: "0%",
			rotateY: "0deg",
			//scale: 1,
		},
		exit: {
			// z: ({ isEntering }) => (isEntering ? "200%" : "-200%"),
			delay: 300,
			opacity: 0,
			duration: 400,
			rotateY: "90deg",
			//scale: 0,
		},
		props: { isEntering: true },
	},

	bargingIn: {
		enter: {
			delay: 500,
			beforeChildren: 400,
			opacity: 1,
			duration: 400,
			// z: "0%",
			x: "0vw",
			//scale: 1,
		},
		exit: {
			// z: ({ isEntering }) => (isEntering ? "200%" : "-200%"),
			delay: 300,
			opacity: 0,
			duration: 400,
			x: "100vw",
			//scale: 0,
		},
		props: { isEntering: true },
	},

	whiteOut: {
		enter: {
			delay: 300,
			opacity: 1,
			duration: 300,
			beforeChildren: true,
			// z: "0%",
			//scale: 1,
		},
		exit: {
			// z: ({ isEntering }) => (isEntering ? "200%" : "-200%"),
			delay: 300,
			opacity: 0,
			duration: 300,
			//backgroundColor: "#e0e0e0"

			//scale: 0,
		},
	},
	zoom: {
		enter: {
			delay: 150,
			opacity: 1,
			duration: 200,
			beforeChildren: true,
			zoom: 1,
			// z: "0%",
			//scale: 1,
			x: "0%",
		},
		exit: {
			// z: ({ isEntering }) => (isEntering ? "200%" : "-200%"),
			delay: 0,
			opacity: 0,
			duration: 300,
			zoom: 0.1,
			x: "50%",
			//backgroundColor: "#e0e0e0"

			//scale: 0,
		},
	},
};
export default POSES;
export { POSES, BASE_POSES };
