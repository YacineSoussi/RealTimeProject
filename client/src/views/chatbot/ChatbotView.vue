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
import { onMounted, ref, reactive } from "vue";
import socket from "../../services/socket";
import LocalStorage from "../../services/LocalStorage";

const initialHelpChoices = [
	"Vérifier l'entretien de mon véhicule",
	"Informations sur les véhicules",
	"Informations de contact",
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
			{
				question:
					"Quel date vous conviendrait le mieux pour l'entretien de la moto ?",
			},
			{
				question:
					"Donnez moi le nombre de kilomètres parcourus depuis votre dernier entretien",
			},
			{
				question: "Souhaitez-vous une révision de votre véhicule ?",
			},
		],
	},
	response2: {
		question: "Informations sur les véhicules",
		choices: [
			{
				question: "Quel est le type d'usage de votre véhicule ?",
			},
			{
				question:
					"Quel date vous conviendrait le mieux pour un essai routier ?",
			},
			{
				question:
					"Quel date vous conviendrait le mieux pour un essai tout-terrain ?",
			},
			{
				question:
					"Quel date vous conviendrait le mieux pour un essai sur piste ?",
			},
		],
	},
	response3: {
		question: "Informations de contact",
		choices: [
			{
				question: "Que souhaitez-vous comme information ?",
			},
		],
	},
	response4: {
		question: "Stopper la conversation",
		choices: [],
	},
};
const socketRef = ref(null);

let initialChoice = ref("");
let deepResponse = ref(0);
let questionsAnswered = ref([]);
let questionPending = reactive({
	question: "",
	answer: "",
});

/**
 * Define the event listener on the input message
 */
onMounted(() => {
	socketRef.current = socket;
	socketRef.current.auth = { userId: LocalStorage.get("user")?.id };
	socketRef.current.connect();

	// Manage input availability and status color
	socketRef.current.on("connect", () => {
		document.getElementById("chat").innerHTML = "";

		const status = document.getElementById("status");

		status.classList.remove("bg-red-600");
		status.classList.add("bg-green-600");

		initChatBotWelcomeMessage();
	});

	document.getElementById("message").addEventListener("keyup", function (e) {
		if (e && e.key === "Enter" && e.target.value !== "") {
			setUserMessage(e.target.value);
		}
	});
});

/**
 * Set the user message
 * @param { string } message The message to send to the chatbot
 * @param { boolean } force Force the message to be sent
 */
function setUserMessage(message, force = true) {
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
		if (force) {
			manageFirstChoiceOfSelection(message);
		}
	} else if (data.response2.question === initialChoice.value) {
		if (force) {
			manageSecondChoiceOfSelection(message);
		}
	} else if (data.response3.question === initialChoice.value) {
		if (force) {
			manageThirdChoiceOfSelection(message);
		}
	} else if (data.response4.question === initialChoice.value) {
		manageFourthChoiceOfSelection(message);
	} else {
		throw new Error("Choice not managed");
	}
}

/**
 * Manage the second choice of the selection
 * PS: Informations sur les véhicules
 */
function manageSecondChoiceOfSelection() {
	setQuestion();
	setTimeout(() => {
		document.getElementById("message").setAttribute("disabled", true);
		displayTypesOfUseCase();
	}, 1500);
	deepResponse.value++;
}

/**
 * Manage the third choice of the selection
 * PS: Informations de contact
 */
function manageThirdChoiceOfSelection() {
	setQuestion();
	setTimeout(() => {
		displayContactInformation();
		document.getElementById("message").setAttribute("disabled", true);
	}, 1500);
}

/**
 * Manage the fourth choice of the selection
 * PS: Stopper le workflow
 */
function manageFourthChoiceOfSelection() {
	setChatBotMessage("Fin de la conversation");
	setTimeout(() => {
		document.getElementById("message").setAttribute("disabled", true);
	}, 1500);
}

/**
 * Set the question according to user choice
 */
function setQuestion() {
	if (questionPending.question === "") {
		if (initialChoice.value === data.response1.question) {
			questionPending.question =
				data.response1.choices[deepResponse.value].question;
			setChatBotMessage(data.response1.choices[deepResponse.value].question);
		} else if (initialChoice.value === data.response2.question) {
			questionPending.question =
				data.response2.choices[deepResponse.value].question;
			setChatBotMessage(data.response2.choices[deepResponse.value].question);
		} else if (initialChoice.value === data.response3.question) {
			questionPending.question =
				data.response3.choices[deepResponse.value].question;
			setChatBotMessage(data.response3.choices[deepResponse.value].question);
		} else {
			throw new Error("Question not managed");
		}
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

		button.style.height = "40px";
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
 * Handle the help choices selection
 * @param { string } choice The choice selected
 */
function handleSelectHelpChoice(choice) {
	document
		.getElementById("chat")
		.removeChild(document.getElementById("help-choices"));
	initialChoice.value = choice;
	setUserMessage(choice);
}

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
 * Set disponibilities of week
 * PS: This is just an example waiting for the API
 */
function setDisponibilitiesOfWeek() {
	const datesForCurrentWeek = getDatesOfCurrentWeek(); // First case
	// const datesForCurrentWeek = []; // Second case

	// const datesForNextWeek = getDatesOfNextWeek(); // Second case
	const datesForNextWeek = []; // First case

	// CASE 1 : There are no disponibilities for the current week
	if (datesForCurrentWeek.length === 0) {
		setChatBotContent(
			"Il n'y a pas de disponibilités pour la semaine en cours"
		);
		setQuestion();

		// Wait 1.5 seconds to display the disponibilities for the next week
		// 1.5 seconds is defined in the setQuestion method
		setTimeout(() => {
			displayDatesDisponibilities(datesForNextWeek);
		}, 1500);
	}

	if (datesForCurrentWeek.length > 0) {
		// CASE 2 : There are disponibilities for the current week
		setQuestion();

		// Wait 1.5 seconds to display the disponibilities for the next week
		// 1.5 seconds is defined in the setQuestion method
		setTimeout(() => {
			displayDatesDisponibilities(datesForCurrentWeek);
		}, 1500);
	}
}

/**
 * Display date disponibilities on the chat
 * @param { Array } data The disponibilities to display
 */
function displayDatesDisponibilities(data) {
	const chat = document.getElementById("chat");
	const div = document.createElement("div");

	div.classList.add("flex");
	div.classList.add("items-center");
	div.classList.add("space-x-2");
	div.id = "dates-for-current-or-next-week";

	for (let i = 0; i < data.length; i++) {
		const button = document.createElement("button");

		button.style.height = "40px";
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
		button.innerText = data[i];
		button.addEventListener("click", () => handleSelectedDate(data[i]));

		div.appendChild(button);
	}

	chat.appendChild(div);
}

/**
 * Display types of use case on the chat
 */
function displayTypesOfUseCase() {
	const chat = document.getElementById("chat");
	const div = document.createElement("div");

	div.classList.add("flex");
	div.classList.add("items-center");
	div.classList.add("space-x-2");
	div.id = "type-of-use-case";

	const data = ["Routier", "Tout-terrain", "Sportif"];

	for (let i = 0; i < data.length; i++) {
		const button = document.createElement("button");

		button.style.height = "40px";
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
		button.innerText = data[i];
		button.addEventListener("click", () => handleSelectedUseCaseType(data[i]));

		div.appendChild(button);
	}

	chat.appendChild(div);
}

/**
 * Display contact information on the chat
 */
function displayContactInformation() {
	const chat = document.getElementById("chat");
	const div = document.createElement("div");

	div.classList.add("flex");
	div.classList.add("items-center");
	div.classList.add("space-x-2");
	div.id = "contact-information";

	const data = ["Adresse mail", "Téléphone"];

	for (let i = 0; i < data.length; i++) {
		const button = document.createElement("button");

		button.style.height = "40px";
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
		button.innerText = data[i];
		button.addEventListener("click", () =>
			handleSelectedContactInformation(data[i])
		);

		div.appendChild(button);
	}

	chat.appendChild(div);
}

/**
 * Get the dates of the current week without the current day
 */
function getDatesOfCurrentWeek() {
	let currentDay = new Date();
	let week = [];
	const today = currentDay.toISOString().slice(0, 10);

	for (let i = 1; i <= 7; i++) {
		let first = currentDay.getDate() - currentDay.getDay() + i;
		let day = new Date(currentDay.setDate(first)).toISOString().slice(0, 10);
		week.push(day);
	}

	// Remove the current day form the array
	if (week.includes(today)) {
		week.splice(week.indexOf(today), 1);
	}

	const weekFormatted = [];

	// Format the dates into format dd/mm/yyyy
	week.forEach((day) => {
		const daySplit = day.split("-");
		weekFormatted.push(`${daySplit[2]}/${daySplit[1]}/${daySplit[0]}`);
	});

	return weekFormatted;
}

/**
 * Get the dates of the next week
 */
function getDatesOfNextWeek() {
	let currentDay = new Date();
	const diffToLastDay = 7 - currentDay.getDay();
	let lastDay = currentDay.getDate() + diffToLastDay;
	let week = [];

	for (let i = 1; i <= 7; i++) {
		let first = lastDay + i;
		let day = new Date(currentDay.setDate(first)).toISOString().slice(0, 10);
		week.push(day);
	}

	const weekFormatted = [];

	// Format the dates into format dd/mm/yyyy
	week.forEach((day) => {
		const daySplit = day.split("-");
		weekFormatted.push(`${daySplit[2]}/${daySplit[1]}/${daySplit[0]}`);
	});

	return weekFormatted;
}

/**
 * Manage the first choice of the selection
 * PS: Vérfier l'entretien de la voiture
 * @param { string } message The message of the user
 */
function manageFirstChoiceOfSelection(message) {
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
	if (questionsAnswered.value.length === 2 && deepResponse.value < 3) {
		const years = getNumberOfYears(
			getDateConvertedToGoodFormat(questionsAnswered.value[1].answer)
		);

		// --- CASE : If date if greater than 1 year --- //
		if (years > 1) {
			setDisponibilitiesOfWeek();

			// Timer is the default in the chatbot
			setTimeout(() => {
				document.getElementById("message").setAttribute("disabled", true);
			}, 1500);

			deepResponse.value++;
		}

		// --- CASE : If date if less than 1 year --- //
		if (years < 1) {
			deepResponse.value++;
			setQuestion();
			setAnswer(message);
		}
	}

	// 3 questions of first choice selected are asked and validated
	if (
		questionsAnswered.value.length === 2 &&
		(deepResponse.value === 3 || deepResponse.value === 4)
	) {
		const numberRegex = /^[0-9]+$/;

		if (deepResponse.value === 3) {
			deepResponse.value++;
		} else {
			if (numberRegex.test(message)) {
				// --- CASE : If the number of kilometers is greater or equal to 10000 --- //
				if (message >= 10000) {
					deepResponse.value -= 3;
					setAnswer(message);
					setAnswered();
					setDisponibilitiesOfWeek();
					deepResponse.value++;
				}

				// --- CASE : If the number of kilometers is less than 10000 --- //
				if (message < 10000) {
					setAnswer(message);
					setAnswered();
					deepResponse.value--;
					setQuestion();
				}
			} else {
				document.getElementById("message").setAttribute("disabled", true);
				setChatBotMessage("Veuillez entrer un nombre de kilomètres valide");
			}
		}
	}

	// 4 questions of first choice selected are asked and validated
	if (
		questionsAnswered.value.length === 3 &&
		(deepResponse.value === 4 || deepResponse.value === 5)
	) {
		if (deepResponse.value === 4) {
			deepResponse.value++;
		} else {
			// --- CASE : Client accept revision of the vehicle --- //
			if (message.toLowerCase() === "oui") {
				document.getElementById("message").setAttribute("disabled", true);
				deepResponse.value -= 4;
				setAnswer(message);
				setAnswered();
				setDisponibilitiesOfWeek();
			} else if (message.toLowerCase() === "non") {
				resetConversation();
			} else {
				setChatBotMessage("Veuillez répondre oui ou non");
			}
		}
	}
}

/**
 * Handle the selected date for the first choice
 * @param { string } date The selected date
 * PS: waiting for API to set date in the database
 */
function handleSelectedDate(date) {
	document.getElementById("dates-for-current-or-next-week").remove();
	document.getElementById("message").setAttribute("disabled", true);

	setUserMessage(date, false);
	setAnswer(date);
	setAnswered();
	// TODO registry date selected in the database
	setChatBotContent(
		`Votre réservation a bien été pris en compte pour le ${date}`
	);
	resetConversation();
}

/**
 * Handle the selected use case for the second choice
 * @param { string } type The selected use case
 * PS: waiting for API to set the selected date of schedule in the database
 */
function handleSelectedUseCaseType(type) {
	document.getElementById("type-of-use-case").remove();

	setUserMessage(type, false);
	setAnswer(type);
	setAnswered();

	if (type === "Routier") {
		deepResponse.value--;
	} else if (type === "Tout-terrain") {
	} else if (type === "Sportif") {
		deepResponse.value++;
	} else {
		throw new Error("Type of use case not managed");
	}

	setQuestion();
	setDisponibilitiesOfWeek();

	setTimeout(() => {
		document.getElementById("message").setAttribute("disabled", true);
	}, 1500);
}

/**
 * Handle the selected contact information for the third choice
 * @param { string } information The selected contact information
 */
function handleSelectedContactInformation(information) {
	const email = "contact@moto-mania.fr";
	const phone = "01 23 45 67 89";

	document.getElementById("contact-information").remove();

	setUserMessage(information, false);
	setAnswer(information);
	setAnswered();

	if (information === "Adresse mail") {
		setChatBotMessage(
			`Si vous souhaitez nous contacter par mail, voici notre adresse mail : ${email}`
		);
	} else if (information === "Téléphone") {
		setChatBotMessage(
			`Si vous souhaitez nous contacter par téléphone, voici notre numéro : ${phone}`
		);
	} else {
		throw new Error("Contact information not managed");
	}

	setTimeout(() => {
		setChatBotContent("Fin de la conversation");
	}, 1500);
}

/**
 * Reset the conversation of the chatbot
 */
function resetConversation() {
	setChatBotContent("Fin de la conversation");
	setChatBotContent("Le workflow va redémarré dans 10 secondes");
	setTimeout(() => {
		resetWorkflow();
	}, 10000);
}

/**
 * Reset the workflow of the chatbot
 */
function resetWorkflow() {
	document.getElementById("chat").innerHTML = "";
	initialChoice.value = "";
	deepResponse.value = 0;
	questionsAnswered.value = [];
	questionPending.value = {
		question: "",
		answer: "",
	};
	initChatBotWelcomeMessage();
}
</script>

<style scoped></style>
