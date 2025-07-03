document.querySelectorAll('.con').forEach(item => {
item.addEventListener('click', () => {
    item.classList.toggle('active');
});
});


/*menu adaptable */
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
menuToggle.addEventListener('click', () => {
    menu.classList.toggle('active');
});