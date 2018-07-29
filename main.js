// Elements
const setWorkFi = document.getElementById("set-work");
const setRestFi = document.getElementById("set-rest");
const timeMinFi = document.getElementById("time-min");
const timeSecFi = document.getElementById("time-sec");
const activeTask = document.getElementById("active-task");
const radios = document.querySelectorAll("input[type=radio]");
const textFields = document.querySelectorAll("input[type=text]");
const pomCounterElem = document.getElementById("pom-counter-elem");
const restCounterElem = document.getElementById("rest-counter-elem");
const taskStock = document.getElementById("task-stock");
const notesContainer = document.querySelector(".notes-container");


// Buttons
const workPlusBut = document.getElementById("work-plus-but");
const workMinusBut = document.getElementById("work-minus-but");
const restPlusBut = document.getElementById("rest-plus-but");
const restMinusBut = document.getElementById("rest-minus-but");
const startBut = document.getElementById("start");
const stopBut = document.getElementById("stop");
const resetBut = document.getElementById("reset");
const newNoteBut = document.getElementById("new-note");
const clearNotesBut = document.getElementById("clear-notes");

//Fields
const taks1 = document.getElementById("task1");
const taks2 = document.getElementById("task2");
const taks3 = document.getElementById("task3");
const radioTask1 = document.getElementById("radio-task1");
const radioTask2 = document.getElementById("radio-task2");
const radioTask3 = document.getElementById("radio-task3");

//Listeners
workPlusBut.addEventListener("click", increaseWork);
workMinusBut.addEventListener("click", decreaseWork);
restPlusBut.addEventListener("click", increaseRest);
restMinusBut.addEventListener("click", decreaseRest);
startBut.addEventListener("click", start);
stopBut.addEventListener("click", stop);
resetBut.addEventListener("click", reset);
newNoteBut.addEventListener('click', newNote);
clearNotesBut.addEventListener('click', clearNotes);
notesContainer.addEventListener('click', removeNote);

for (let elem of radios) {
	elem.addEventListener("click", selectTask);
}

for (let elem of textFields) {
	elem.addEventListener("focus", selectField);
	elem.addEventListener("keyup", selectField);
}

//Variables
let timer, minutes, seconds;
let isTimerOn = false;
let isActive = false;
let isPomodoro = true;
let currentTask = task1.value.toUpperCase();
let pomCounter = 0;
let restCounter = 0;
let taskObject = {};

// Functions

//Work-----------------------------------------------------------------------

function increaseWork() {
	if (isTimerOn) return;
	setWorkFi.innerText = +setWorkFi.innerText + 1;
	timeMinFi.innerText = setWorkFi.innerText;
	if (timeMinFi.innerText <= 9) timeMinFi.innerText = "0" + timeMinFi.innerText;
}

function decreaseWork() {
	if (isTimerOn || setWorkFi.innerText == 1) return;
	setWorkFi.innerText = +setWorkFi.innerText - 1;
	timeMinFi.innerText = setWorkFi.innerText;
	if (timeMinFi.innerText <= 9) timeMinFi.innerText = "0" + timeMinFi.innerText;
}

//Rest-----------------------------------------------------------------------

function increaseRest() {
	if (isTimerOn) return;
	setRestFi.innerText = +setRestFi.innerText + 1;
}

function decreaseRest() {
	if (isTimerOn || setRestFi.innerText == 1) return;
	setRestFi.innerText = +setRestFi.innerText - 1;
}

//Start-----------------------------------------------------------------------
function start() {
	if (isActive) return;

	if (isPomodoro) {
		activeTask.innerHTML = "Pomodoro";
	} else {
		activeTask.innerHTML = "Rest";
	}

	if (!isTimerOn) {
		minutes = +timeMinFi.innerText - 1;
		seconds = 60;
	}

	isActive = true;
	isTimerOn = true;
	timer = setTimeout(function tick() {
		if (minutes == 0 && seconds == 0) {
			if (isPomodoro) {
				setRest();
				countTasks();
			} else {
				setPomodoro();
			}
			timeMinFi.innerText = minutes;
			if (timeMinFi.innerText <= 9)
				timeMinFi.innerText = "0" + timeMinFi.innerText;
			timer = setTimeout(tick, 0);
		} else if (seconds == 0) {
			seconds = 60;
			minutes -= 1;
			timer = setTimeout(tick, 1000);
		} else {
			seconds -= 1;
			timeSecFi.innerText = seconds;
			if (timeSecFi.innerText <= 9) timeSecFi.innerText = "0" + seconds;
			timeMinFi.innerText = minutes;
			if (timeMinFi.innerText <= 9) timeMinFi.innerText = "0" + minutes;
			timer = setTimeout(tick, 1000);
		}
	}, 0);
}
//Stop-----------------------------------------------------------------------
function stop() {
	if (!isActive) return;
	clearTimeout(timer);
	isActive = false;
	activeTask.innerHTML = "- Stop -";
}
//Reset-----------------------------------------------------------------------
function reset() {
	if (!isTimerOn) return;
	clearTimeout(timer);
	isActive = false;
	isTimerOn = false;
	isPomodoro = true;
	taskObject = {};
	pomCounterElem.innerText = 0;
	restCounterElem.innerText = 0;
	timeMinFi.innerText = setWorkFi.innerText;
	if (timeMinFi.innerText <= 9) timeMinFi.innerText = "0" + timeMinFi.innerText;
	timeSecFi.innerText = "00";
	activeTask.innerHTML = "- Stop -";
	const allP = document.querySelectorAll("#task-stock > p");
	allP.forEach(function (elem) {
		elem.remove();
	})
}

//------------------------- New Note---------------------------------------------------------


function newNote() {
	newNote.counter += 1;
	const elem = document.createElement('div');
	elem.className = "note-elem";
	elem.innerHTML = `<p>Note ${newNote.counter}</p><div><textarea rows='1' name='' id=''></textarea><button class='button' id=''>X</button></div>`
	notesContainer.appendChild(elem);
	const textarea = elem.querySelector('textarea');
	textarea.focus();
	textarea.onkeyup = function () {
		auto_grow(this);
	}
}
newNote.counter = 0;

//------------------------- Clear Notes---------------------------------------------------------

function clearNotes() {
	const elems = document.querySelectorAll('.note-elem');
	elems.forEach(function (elem) {
		elem.remove();
		newNote.counter = 0;
	})
}
//------------------------- Remove Note---------------------------------------------------------

function removeNote(e) {
	if (!e.target.matches('button')) return;
	const elem = e.target.closest('.note-elem');
	elem.remove();
}

//------------------------- Other---------------------------------------------------------

function setRest() {
	minutes = +setRestFi.innerText;
	isPomodoro = false;
	activeTask.innerHTML = "Rest";
	pomCounterElem.innerText = +pomCounterElem.innerText + 1;
	const audio = document.getElementById("work-sound");
	audio.play();
}

function setPomodoro() {
	minutes = +setWorkFi.innerText;
	isPomodoro = true;
	activeTask.innerHTML = "Pomodoro";
	restCounterElem.innerText = +restCounterElem.innerText + 1;
	const audio = document.getElementById("rest-sound");
	audio.play();
}

function selectTask(e) {
	const select = document.getElementById(e.target.id.slice(6));
	e.target.value = select.value;
	currentTask = e.target.value.toUpperCase();
}

function selectField(e) {
	const select = document.getElementById("radio-" + e.target.id);
	for (let elem of radios) {
		elem.checked = false;
	}
	select.checked = true;
	select.value = e.target.value;
	currentTask = select.value.toUpperCase();
}

function countTasks() {

	if (taskObject[currentTask] === undefined) {
		taskObject[currentTask] = 0;
		const namep = document.createElement('p');
		taskStock.appendChild(namep);
		namep.innerText = currentTask;
		const numberp = document.createElement('p');
		taskStock.appendChild(numberp);
		numberp.id = "task-id-" + currentTask;
		numberp.innerHTML = taskObject[currentTask];
	}

	taskObject[currentTask] = taskObject[currentTask] + 1;
	const select = document.getElementById("task-id-" + currentTask);
	select.innerHTML = taskObject[currentTask];
}

function auto_grow(element) {
	console.log(element.scrollHeight);
	if (element.scrollHeight > 26) {
		element.style.height = "22px";
		element.style.height = (element.scrollHeight) + "px";
	}
}

window.onbeforeunload = function (e) {
	return "NO!!!";
};