const cardDisplayContainer = document.querySelector(".card-display-container");
const cardBack = document.querySelector(".card-back");
const cardFront = document.querySelector(".card-front");

cardBack.style.left = `${(cardDisplayContainer.offsetWidth / 2 - cardBack.offsetWidth / 2) + 40}px`;
cardFront.style.left = `${(cardDisplayContainer.offsetWidth / 2 - cardFront.offsetWidth / 2) - 40}px`;

const form = document.getElementById("card-form");
const completeStateSection = document.querySelector(".completed-state-section");

window.addEventListener("resize", () => {
    cardBack.style.left = `${(cardDisplayContainer.offsetWidth / 2 - cardBack.offsetWidth / 2) + 40}px`;
    cardFront.style.left = `${(cardDisplayContainer.offsetWidth / 2 - cardFront.offsetWidth / 2) - 40}px`;
})

if (window.innerWidth < 1100) {
    completeStateSection.style.height = `${form.offsetHeight + 1}px`;
} else {
    completeStateSection.style.height = `${cardDisplayContainer.offsetHeight}px`;
}

window.addEventListener("resize", () => {console.log("Resize window widht:", window.innerWidth);
    if (window.innerWidth < 1100) {
        completeStateSection.style.height = `${form.offsetHeight + 1}px`;
    } else {
        completeStateSection.style.height = `${cardDisplayContainer.offsetHeight}px`;
    }
})

const inputs = document.querySelectorAll("input");
const errorMsgs = document.querySelectorAll(".invalid-input-message");

const namePattern = /^[A-Za-z]+(\s[A-Za-z]+)+$/;
const cardNumberPattern = /^(\d{4}\s){3}\d{4}$/;

const cvcSpan = document.querySelector(".cvc-span");
const cardNumberSpan = document.querySelector(".card-number-span");
const nameSurnameSpan = document.querySelector(".name-and-surname-span");
const monthSpan = document.querySelector(".month-span");
const yearSpan = document.querySelector(".year-span");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let emptyCounter = 0;
    let invalidCounter = 0;
    let invalidMonth = false;

    inputs.forEach((input, index) => {
        if (index > 2) i = index - 1;
        else i = index;

        if (input.value === "") {
            invalidInput(input, i, "Can't be blank");
            emptyCounter++;
            if (i = 2) invalidMonth = true;
        } else {
            validInput(input, i);
            if (invalidMonth && index === 3 && index.value !== "") errorMsgs[i].classList.add("invalid-input-message-active");
            invalidMonth = false;
        }
    })

    if (!namePattern.test(inputs[0].value.trim()) && inputs[0].value !== "") {
        invalidInput(inputs[0], 0, "Wrong format, name and surname, no symbols");
        invalidCounter++;
    }

    if (!cardNumberPattern.test(inputs[1].value.trim()) && inputs[1].value !== "") {
        invalidInput(inputs[1], 1, "Wrong format, must have 16 numbers");
        invalidCounter++;
    }

    if ((inputs[2].value > 12 || inputs[2].value < 1) && (inputs[2].value !== "" && inputs[3].value !== "")) {
        invalidInput(inputs[2], 2, "Must be a valid date");
        invalidCounter++;
    }

    let actualYear = new Date();
    actualYear = actualYear.getFullYear();
    actualYear = actualYear % 100;

    let currentMonth = new Date();
    currentMonth = currentMonth.getMonth() + 1;

    if (inputs[3].value < actualYear && inputs[3].value !== "") {
        if (inputs[2].value !== "") invalidInput(inputs[3], 2, "Must be in the future");
        else inputs[3].classList.add("invalid-input");
        invalidCounter++;
    }

    if (parseInt(inputs[3].value) === parseInt(actualYear) && parseInt(inputs[2].value) < parseInt(currentMonth) && inputs[2].value !== "") {
        invalidInput(inputs[2], 2, "Must be in the future");
        invalidCounter++;
    }

    if (inputs[4].value < 3 && inputs[4].value !== "") {
        invalidInput(inputs[4], 3, "Wrong format, must have 3 numbers");
        invalidCounter++;
    }

    if (invalidCounter === 0 && emptyCounter === 0) {
        if (inputs[2].value < 10 && !monthSpan.textContent.includes("0")) {
            inputs[2].value = "0" + inputs[2].value;
            monthSpan.textContent = `${"0" + monthSpan.textContent}`;
        }
        if (inputs[3].value < 10 && !yearSpan.textContent.includes("0")) {
            inputs[3].value = "0" + inputs[3].value;
            yearSpan.textContent = `${"0" + yearSpan.textContent}`;
        }
        completeStateSection.classList.add("completed-state-section-active");
        form.classList.add("form-inactive");
    }
})

const continueButton = document.getElementById("continue-button");

continueButton.addEventListener("click", () => {
    completeStateSection.classList.remove("completed-state-section-active");
    form.classList.remove("form-inactive");
})

function invalidInput(input, index, msg) {
    input.classList.add("invalid-input");
    errorMsgs[index].classList.add("invalid-input-message-active");
    errorMsgs[index].textContent = msg;
}

function validInput(input, index) {
    input.classList.remove("invalid-input");
    errorMsgs[index].classList.remove("invalid-input-message-active");
}

inputs[0].addEventListener("input", () => {
    filterNumbers(inputs[0]);
    fillInRealTime(inputs[0], nameSurnameSpan);
    inputLimit(inputs[0], 37);
    moveToNextInput(inputs[0], inputs[1], 37);
})

inputs[1].addEventListener("input", () => {
    filterLetters(inputs[1]);
    formatCardNumber(inputs[1]);
    inputLimit(inputs[1], 19);
    fillInRealTime(inputs[1], cardNumberSpan);
    moveToNextInput(inputs[1], inputs[2], 19);
})

inputs[2].addEventListener("input", () => {
    filterLetters(inputs[2]);
    inputLimit(inputs[2], 2);
    fillInRealTime(inputs[2], monthSpan);
    moveToNextInput(inputs[2], inputs[3], 2);
})

inputs[3].addEventListener("input", () => {
    filterLetters(inputs[3]);
    inputLimit(inputs[3], 2);
    fillInRealTime(inputs[3], yearSpan);
    moveToNextInput(inputs[3], inputs[4], 2);
})

inputs[4].addEventListener("input", () => {
    filterLetters(inputs[4]);
    inputLimit(inputs[4], 3);
    fillInRealTime(inputs[4], cvcSpan);
})

function inputLimit(input, maxLength) {
    const inputValue = input.value;
    if (inputValue.length > maxLength) input.value = inputValue.slice(0, maxLength);
}

function filterNumbers(input) {
    const inputValue = input.value;
    const newValue = inputValue.replace(/\d/g, '');
    input.value = newValue;
}

function filterLetters(input) {
    const inputValue = input.value;
    const newValue = inputValue.replace(/\D/g, '');
    input.value = newValue;
}

function formatCardNumber(input) {
    const inputValue = input.value;
    const number = inputValue.replace(/\D/g, '');
    const formatedNumber = number.replace(/(\d{4})/g, '$1 ');
    input.value = formatedNumber;
}

function fillInRealTime(input, span) {
    let inputValue = input.value.trim();
    span.textContent = inputValue;
}

function moveToNextInput(input, nextInput, maxLength) {
    if (input.value.length === maxLength) {
        if (nextInput) {
            nextInput.focus();
        }
    }
}