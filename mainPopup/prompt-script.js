const generateButton = document.getElementById("SummaryGeneratorButton")
const promptTextarea = document.getElementById("PromptTest")

let summaryLength = document.getElementById("SummaryLengthList").value;

const prompts = [
	"Fasse die folgende E-Mail zusammen. Achte darauf, dass die Informationen wie das Datum und Treffenthemen in der Zusammenfassung beinhaltet werden",
	"Ist folgende E-Mail ein Spam?",
	"Was ist die Hauptaussage der E-Mail?",	// Fuer eine kurze Zusammenfassung
	"Welche wichtige Informationen wurden in der E-Mail geteilt?",
	"Welche Anweisungen oder Aufgaben wurden in dieser E-Mail erwähnt?",
	"Welche Fragen oder Anliegen wurden in dieser E-Mail angesprochen?"
];

generateButton.addEventListener('click', function(){
	promptTextarea.value = "Prompt: " + prompts[0];
	promptTextarea.value += "\nSummary length: " + summaryLength;
})