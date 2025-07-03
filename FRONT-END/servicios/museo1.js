const filterButtons = document.querySelectorAll(".filters button");
const galleryItems  = document.querySelectorAll(".gallery-item");

filterButtons.forEach(button => {
button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach(b => b.classList.toggle("active", b === button));

    galleryItems.forEach(item => {
    const categoryMatches = filter === "all" || item.dataset.category === filter;
    item.style.display = categoryMatches ? "block" : "none";
    });
});
});

/*menu adaptable */
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
menuToggle.addEventListener('click', () => {
    menu.classList.toggle('active');
});