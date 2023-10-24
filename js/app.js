// Main elements 
const elForm = document.querySelector('.js-form');
const elInput = document.querySelector(".js-input");
const elInfo = document.querySelector('.js-info');
const elBar = document.querySelector('.js-bar');
const elEyeIcon = document.querySelector('.js-eye-icon');
const regExStrongPassword = new RegExp("(([A-Z]|[a-z]){1,}([0-9]){1,}([\@\#\$\%\^\&\*\.\(\)\<\>\?\\\[\]\!\~]){1,}){9,}", 'g');
const regExMediumPassword = new RegExp("(([A-Z]|[a-z]){1,}([0-9]){1,}){4,8}", 'g');
const regExSimplePassword = new RegExp("^(\d{2,7})$|^(\w{2,7})$", 'g');
const elTimeCrack = document.querySelector('.js-time-crack');
// Create Style element for pseudo class 

let elBarWidth = 0;
let level = -1;
let hasRepetation = false;
const style = document.createElement("style");
document.head.appendChild(style);

// Prevent from submitting the form 

elForm.addEventListener('submit', evt => {
    evt.preventDefault();
})

// Key up event listener 

elInput.addEventListener('keyup', (evt) => {
    const val = elInput.value.trim();
    
    // Update other values with new value 

    updateOtherDetails(val);
    
    // Check repetation in string
    
    const characters = val.split('').reduce((acc,item) => {
        if(!acc[item]) acc[item] = [];
        acc[item].push(item);
        return acc;
    }, {});

    hasRepetation = Object.values(characters).every(item => item.length >= 4);
    
    //    Increase width of Bar
   
    elBarWidth = val.length * 2;

    updateBar();

    // Complexity level checker controller


    if(!val.length) {
        addClassAndRemoveOthers(elInfo, '', true);
        elInfo.textContent = 'none';
        addClassAndRemoveOthers(elTimeCrack, '', true);
        elTimeCrack.textContent = 'none';
        return;
    }

    if(regExStrongPassword.test(val) || (val.length > 35 && !hasRepetation)) {
        level = 1;
        updateBar();
        addClassAndRemoveOthers(elInfo, "strong");
        elInfo.textContent = 'Strong Password';
        addClassAndRemoveOthers(elTimeCrack, "strong");
        elTimeCrack.textContent = 'centuries';
        return;
    }

    if(regExMediumPassword.test(val) || val.length > 20) {
        if(elBarWidth > 65) elBarWidth = 65;
        level = 0;
        updateBar();
        addClassAndRemoveOthers(elInfo, "medium");
        elInfo.textContent = 'Medium Password';
        addClassAndRemoveOthers(elTimeCrack, "medium");
        elTimeCrack.textContent = 'couple of months or days';
        return;
    }

    if(regExSimplePassword.test(val) || val.length < 8) {
        if(elBarWidth > 30) elBarWidth = 30;
        level = -1;
        updateBar();
        addClassAndRemoveOthers(elInfo, "simple");
        elInfo.textContent = 'Simple Password';
        addClassAndRemoveOthers(elTimeCrack, "simple");
        elTimeCrack.textContent = 'couple of seconds or minutes';
        return;
    }
   

});

// Eye icon password controller
elEyeIcon.addEventListener('click', (evt) => {
    elInput.type === 'password' ? elInput.type = 'text' : elInput.type = 'password';
    elEyeIcon.classList.toggle('eye-closed-icon');
});


function updateBar() {
    style.innerHTML = `.password__progress-bar::before {width: ${elBarWidth}%}`;

    if(level == -1) elBar.classList.add('simple');
    else elBar.classList.remove('simple');
    
    if(level == 0) elBar.classList.add('medium');
    else elBar.classList.remove('medium');

    if(level == 1) elBar.classList.add('strong');
    else elBar.classList.remove('strong');

}


function updateOtherDetails(val) {
    const elChar = document.querySelector('.js-chars');
    const elDigit = document.querySelector('.js-digits');
    const elCapLetter = document.querySelector('.js-capital-letters');
    const elSmallLetter = document.querySelector('.js-small-letters');

    const sortedObj = {
        chars: [],
        digits: [],
        capLetters: [],
        smallLetters: []
    }
    const arr = val.split('');

    arr.forEach(item => {
        if(item.charCodeAt() >= 32 && item.charCodeAt() <= 47) sortedObj?.chars.push(item);
        if(item.charCodeAt() >= 48 && item.charCodeAt() <= 57) sortedObj?.digits.push(item);
        if(item.charCodeAt() >= 65 && item.charCodeAt() <= 90) sortedObj?.capLetters.push(item);
        if(item.charCodeAt() >= 97 && item.charCodeAt() <= 122) sortedObj?.smallLetters.push(item);
    });
    
    elChar.textContent = sortedObj.chars.length;
    elDigit.textContent = sortedObj.digits.length;
    elCapLetter.textContent = sortedObj.capLetters.length;
    elSmallLetter.textContent = sortedObj.smallLetters.length;
    
    
    
    
    // const no_chars_in_ascii = 16; 
    // const no_chars_in_digits = 10; 
    // const no_chars_in_sm_letters = 26; 
    // const no_chars_in_cp_letters = 26; 
    
    // const numberOfAttemptsPerSecond = 1000;
    // const numberOfCombinations = (sortedObj.chars.length * no_chars_in_ascii) + 
    // (sortedObj.digits.length * no_chars_in_digits) + 
    // (sortedObj.capLetters.length * no_chars_in_cp_letters) + 
    // (sortedObj.smallLetters.length + no_chars_in_sm_letters);
    // const sampleSpace = Math.pow(numberOfCombinations, val.length);
    // elTimeCrack.textContent = (sampleSpace/(numberOfAttemptsPerSecond*31.536 * 10^6)).toFixed(2) + ' years';
}


function addClassAndRemoveOthers(el, class_to_add, removeOnly = false) {
    const classes = ["simple", "medium", "strong"];
    if(removeOnly) {
        el.classList.remove(...classes);
        return;
    }
    
    classes.splice(classes.indexOf(class_to_add), 1);
    el.classList.remove(...classes);
    el.classList.add(class_to_add);
}