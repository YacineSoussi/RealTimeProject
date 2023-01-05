<template>
	<div class="container mx-auto">
		<div class="min-w-full border rounded lg:grid">
			<div class="lg:col-span-2 lg:block">
				<div class="w-full">
					<div class="relative flex items-center p-3 border-b border-gray-300">
						<font-awesome-icon
							:icon="['fas', 'robot']"
							style="margin-bottom: -3px"
						/>
						<span
							class="absolute w-3 h-3 bg-red-600 rounded-full left-10 top-3"
							id="status"
						></span>
					</div>
					<div class="relative w-full p-6 overflow-y-auto h-[40rem]">
						<ul id="chat"></ul>
					</div>
					<div
						class="flex items-center justify-between w-full p-3 border-t border-gray-300"
					>
						<input
							type="text"
							id="message"
							placeholder="Message"
							class="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
							name="message"
							required
							disabled
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import io from "socket.io-client";
import { onMounted, ref, reactive } from "vue";

// ------------------ INITIALIZATION VARIABLES ------------------ //

const socket = io("http://localhost:3000");
const initialHelpChoices = [
	"Vérifier l'entretien de mon véhicule",
	"Des informations sur les véhicules",
	"Des informations de contact",
	"Stopper la conversation",
];
const data = {
	response1: {
		question: "Vérifier l'entretien de mon véhicule",
		choices: [
			{
				question: "Quel est l'année de votre véhicule ?",
			},
			{
				question: "Quel est la date du dernier entretien de la moto ?",
			},
		],
	},
	response2: {
		question: "Informations sur les véhicules",
		choices: [
			{
				question: "Quel est le type d'usage de votre véhicule ?",
			},
		],
	},
	response3: {
		question: "Informations de contact",
		choices: [
			{
				question: "Souhaitez-vous une adresse email de contact ?",
			},
			{
				question: "Souhaitez-vous un numéro de téléphone de contact ?",
			},
		],
	},
	response4: {
		question: "Stopper la conversation",
		choices: [],
	},
};

let initialChoice = ref("");
let deepResponse = ref(0);
let questionsAnswered = ref([]);
let questionPending = reactive({
	question: "",
	answer: "",
});

// ------------------ SOCKET ------------------ //

// Manage input availability and status color
socket.on("connect", () => {
	document.getElementById("chat").innerHTML = "";

	const status = document.getElementById("status");

	status.classList.remove("bg-red-600");
	status.classList.add("bg-green-600");

	initChatBotWelcomeMessage();
});

// ------------------ GLOBAL METHODS ------------------ //

/**
 * Define the event listener on the input message
 */
onMounted(() => {
	document.getElementById("message").addEventListener("keyup", function (e) {
		if (e && e.key === "Enter" && e.target.value !== "") {
			setUserMessage(e.target.value);
		}
	});
});

/**
 * Set the user message
 * @param { string } message The message to send to the chatbot
 */
function setUserMessage(message) {
	if (message && message !== "") {
		const li = document.createElement("li");
		const div = document.createElement("div");
		const span = document.createElement("span");

		li.classList.add("flex");
		li.classList.add("justify-end");

		div.classList.add("relative");
		div.classList.add("max-w-xl");
		div.classList.add("px-4");
		div.classList.add("py-2");
		div.classList.add("text-gray-700");
		div.classList.add("rounded");
		div.classList.add("shadow");
		div.classList.add("mt-4");

		span.classList.add("block");
		span.innerText = message;

		div.appendChild(span);
		li.appendChild(div);

		document.getElementById("chat").appendChild(li);
		document.getElementById("message").value = "";
	}

	if (data.response1.question === initialChoice.value) {
		manageFirstChoiceOfSelection();
	} else if (message === data.response2.question) {
	} else if (message === data.response3.question) {
	} else if (message === data.response4.question) {
	} else {
	}
}

/**
 * Set the question
 */
function setQuestion() {
	if (questionPending.question === "") {
		questionPending.question =
			data.response1.choices[deepResponse.value].question;
		setChatBotMessage(data.response1.choices[deepResponse.value].question);
	}
}

/**
 * Set the answer
 * @param { string } message The message of user
 */
function setAnswer(message) {
	questionPending.answer = message;
	document.getElementById("message").setAttribute("disabled", true);
}

/**
 * Set the question and answer as answered
 * @param { boolean } nextQuestion Call next question or not
 */
function setAnswered(nextQuestion = false) {
	if (questionPending.question !== "" && questionPending.answer !== "") {
		const response = {
			question: questionPending.question,
			answer: questionPending.answer,
		};

		deepResponse.value++;
		questionsAnswered.value.push(response);
		questionPending.question = "";
		questionPending.answer = "";

		if (nextQuestion) {
			setQuestion();
		}
	}
}

/**
 * Set the chatbot message
 * @param { string } message The message to display
 */
function setChatBotMessage(message) {
	const spinnerParent = document.createElement("div");

	spinnerParent.classList.add("flex");
	spinnerParent.classList.add("items-center");
	spinnerParent.classList.add("space-x-2");
	spinnerParent.classList.add("mt-4");

	const firstSpinnerDot = document.createElement("div");

	firstSpinnerDot.classList.add("w-4");
	firstSpinnerDot.classList.add("h-4");
	firstSpinnerDot.classList.add("rounded-full");
	firstSpinnerDot.classList.add("animate-pulse");
	firstSpinnerDot.classList.add("dark:bg-violet-400");

	const secondSpinnerDot = document.createElement("div");

	secondSpinnerDot.classList.add("w-4");
	secondSpinnerDot.classList.add("h-4");
	secondSpinnerDot.classList.add("rounded-full");
	secondSpinnerDot.classList.add("animate-pulse");
	secondSpinnerDot.classList.add("dark:bg-violet-400");

	const thirdSpinnerDot = document.createElement("div");

	thirdSpinnerDot.classList.add("w-4");
	thirdSpinnerDot.classList.add("h-4");
	thirdSpinnerDot.classList.add("rounded-full");
	thirdSpinnerDot.classList.add("animate-pulse");
	thirdSpinnerDot.classList.add("dark:bg-violet-400");

	spinnerParent.appendChild(firstSpinnerDot);
	spinnerParent.appendChild(secondSpinnerDot);
	spinnerParent.appendChild(thirdSpinnerDot);

	document.getElementById("chat").appendChild(spinnerParent);

	setTimeout(() => {
		document.getElementById("chat").removeChild(spinnerParent);
		setChatBotContent(message);
		document.getElementById("message").removeAttribute("disabled");
	}, 1500);
}

/**
 * Set the welcome message of the chatbot
 */
function initChatBotWelcomeMessage() {
	setChatBotContent("Bienvenue sur le chatbot ! Que puis-je faire pour vous ?");
	initHelpChoices();
}

/**
 * Set the help choices of the chatbot
 */
function initHelpChoices() {
	const chat = document.getElementById("chat");
	const div = document.createElement("div");

	div.classList.add("flex");
	div.classList.add("items-center");
	div.classList.add("space-x-2");
	div.id = "help-choices";

	for (let i = 0; i < initialHelpChoices.length; i++) {
		const button = document.createElement("button");

		button.classList.add("bg-violet-500");
		button.classList.add("hover:bg-violet-700");
		button.classList.add("text-white");
		button.classList.add("px-4");
		button.classList.add("rounded");
		button.classList.add("shadow");
		button.classList.add("dark:bg-violet-400");
		button.classList.add("dark:hover:bg-violet-600");
		button.classList.add("mt-4");
		button.classList.add("mb-4");
		button.innerText = initialHelpChoices[i];
		button.addEventListener("click", () =>
			handleSelectHelpChoice(initialHelpChoices[i])
		);

		div.appendChild(button);
	}

	chat.appendChild(div);
}

/**
 * Set the chatbot content
 * @param { string } message The message to display
 */
function setChatBotContent(message) {
	const li = document.createElement("li");
	const div = document.createElement("div");
	const span = document.createElement("span");

	li.classList.add("flex");
	li.classList.add("justify-start");

	div.classList.add("relative");
	div.classList.add("max-w-xl");
	div.classList.add("px-4");
	div.classList.add("mt-4");
	div.classList.add("py-2");
	div.classList.add("text-gray-700");
	div.classList.add("rounded");
	div.classList.add("shadow");

	span.classList.add("block");
	span.innerText = message;

	div.appendChild(span);
	li.appendChild(div);

	document.getElementById("chat").appendChild(li);
}

/**
 * Handle the help choices
 * @param { string } choice The choice
 */
function handleSelectHelpChoice(choice) {
	const chat = document.getElementById("chat");
	const helpChoices = document.getElementById("help-choices");

	if (choice === initialHelpChoices[0]) {
		chat.removeChild(helpChoices);
		initialChoice.value = choice;
		setUserMessage(choice);
	} else if (choice === initialHelpChoices[1]) {
		// TODO: Handle the second choice
	} else if (choice === initialHelpChoices[2]) {
		// TODO: Handle the third choice
	} else {
		// TODO: Handle the fourth choice
	}
}

// ------------------ METHODS FOR FIRST CHOICE ------------------ //

/**
 * Get the number of years between a date and now
 * @param { Date } date The date to calculate the years
 */
function getNumberOfYears(date) {
	return new Date(new Date() - new Date(date)).getFullYear() - 1970;
}

/**
 * Get the date converted to a good format
 * @param { string } date The date to convert
 */
function getDateConvertedToGoodFormat(date) {
	let dateSplit;

	if (date.indexOf("/") !== -1) {
		dateSplit = date.split("/");
	} else if (date.indexOf("-") !== -1) {
		dateSplit = date.split("-");
	}

	return `${dateSplit[1]}/${dateSplit[0]}/${dateSplit[2]}`;
}

/**
 * Set disponibilities for the current week
 * PS: This is just an example waiting for the API
 */
function setDisponibilitiesForCurrentWeek() {
	setChatBotContent(
		"Voici ci-dessous les disponibilités pour la semaine en cours"
	);

	const datesForCurrentWeek = [
		"10/10/2020",
		"11/10/2020",
		"12/10/2020",
		"13/10/2020",
		"14/10/2020",
		"15/10/2020",
		"16/10/2020",
	];

	const chat = document.getElementById("chat");
	const div = document.createElement("div");

	div.classList.add("flex");
	div.classList.add("items-center");
	div.classList.add("space-x-2");

	for (let i = 0; i < datesForCurrentWeek.length; i++) {
		const button = document.createElement("button");

		button.classList.add("bg-violet-500");
		button.classList.add("hover:bg-violet-700");
		button.classList.add("text-white");
		button.classList.add("px-4");
		button.classList.add("rounded");
		button.classList.add("shadow");
		button.classList.add("dark:bg-violet-400");
		button.classList.add("dark:hover:bg-violet-600");
		button.classList.add("mt-4");
		button.classList.add("mb-4");
		button.innerText = datesForCurrentWeek[i];

		div.appendChild(button);
	}

	chat.appendChild(div);
}

/**
 * Manage the first choice of the selection
 * PS: Vérfier l'entretien de la voiture
 */
function manageFirstChoiceOfSelection() {
	// 1950 - 2023
	const yearRegex = /^(19[5-9]\d|20[0-4]\d|2023)$/;

	if (deepResponse.value === 0) {
		setQuestion();

		if (message && message !== "" && initialChoice.value !== message) {
			setAnswer(message);

			// Check if the year is valid
			if (yearRegex.test(message)) {
				setAnswered(true);
			} else {
				setChatBotMessage(
					"L'année n'est pas valide, veuillez rentrer une année comprise entre 1950 et 2023"
				);
			}
		}
	} else if (deepResponse.value === 1) {
		// 10/10/2020 ==> day/month/year OR 10-10-2020 ==> day-month-year
		const dateRegex =
			/^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;

		setQuestion();
		setAnswer(message);

		// Check if the date is valid
		if (dateRegex.test(message)) {
			setAnswered();
		} else {
			setChatBotMessage(
				"La date n'est pas valide, veuillez rentrer une date au format jj/mm/aaaa ou jj-mm-aaaa"
			);
		}
	}

	// Two questions of first choice selected are asked and validated
	if (questionsAnswered.value.length === 2) {
		const years = getNumberOfYears(
			getDateConvertedToGoodFormat(questionsAnswered.value[1].answer)
		);

		// --- CASE : If date if greater than 1 year --- //
		if (years > 1) {
			setDisponibilitiesForCurrentWeek();

			// -- CASE 1 -- //
			// If there have no disponibilities for the current week
			// Set a list of disponibilities for the next week

			// -- CASE 2 -- //s
			// If there have disponibilities for the current week
			// Give user to select a date for maintenance
			// Register the date in the database
			// End and restart workflow
		}

		// --- CASE : If date if less than 1 year --- //
		if (years < 1) {
			// TODO
		}
	}
}
</script>

<style scoped></style>
