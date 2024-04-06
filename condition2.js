let year = 2003;
let name = "John";
let nowYear = new Date().getFullYear();
let nowDay = new Date().getDay();
console.log(nowDay);
let nowMonth = new Date().getMonth();
console.log(nowMonth);
let date = new Date().getMonth();
console.log(date);
let age = nowYear-year;
console.log(nowYear);
if (age > 22){
    console.log("Welcome " + name + " to Javascript Course"); 
} else {
    console.log("Please wait for team to carry you. Welcome "+ name + " to Javascript Course");
}
