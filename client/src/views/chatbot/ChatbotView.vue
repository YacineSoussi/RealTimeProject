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
						<button type="button" id="sendButton" @click="setUserMessage">
							<svg
								class="w-5 h-5 text-gray-500 origin-center transform rotate-90"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import io from "socket.io-client";
import { onMounted } from "vue";

// ------------------ INITIALIZATION ------------------ //

const socket = io("http://localhost:3000");
const initialHelpChoices = [
	"Vérifier l'entretien de mon véhicule",
	"Des informations sur les véhicules",
	"Des informations de contact",
	"Stopper la conversation",
];

// ------------------ SOCKET ------------------ //

// Manage input availability and status color
socket.on("connect", () => {
	document.getElementById("chat").innerHTML = "";

	const status = document.getElementById("status");
	const message = document.getElementById("message");

	status.classList.remove("bg-red-600");
	status.classList.add("bg-green-600");

	message.removeAttribute("disabled");

	initChatBotWelcomeMessage();
});

// Event to catch the message from the chatbot
socket.on("message_bot", (message) => setChatBotMessage(message));

// ------------------ METHODS ------------------ //

/**
 * Define the event listener on the input message
 */
onMounted(() => {
	document.getElementById("message").addEventListener("keyup", function (e) {
		if (e && e.key === "Enter" && e.target.value !== "") {
			setUserMessage();
		}
	});
});

/**
 * Set the user message
 * @param { number } response The response number to send to the chatbot
 * @param { string } message The message to send to the chatbot
 */
function setUserMessage(response = 0, message = null) {
	if (!message) {
		message = document.getElementById("message").value;
	}

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

		socket.emit("message", response, message);
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
		setUserMessage(1, choice);
	} else if (choice === initialHelpChoices[1]) {
		// TODO: Handle the second choice
	} else if (choice === initialHelpChoices[2]) {
		// TODO: Handle the third choice
	} else {
		// TODO: Handle the fourth choice
	}
}
</script>

<style scoped></style>
