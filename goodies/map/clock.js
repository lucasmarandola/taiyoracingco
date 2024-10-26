function updateTime() {
const now = new Date();
const hours = now.getHours().toString().padStart(2, '0');
const minutes = now.getMinutes().toString().padStart(2, '0');

document.getElementById('hours').textContent = hours;
document.getElementById('minutes').textContent = minutes;
}
setInterval(updateTime, 1000);
updateTime(); 