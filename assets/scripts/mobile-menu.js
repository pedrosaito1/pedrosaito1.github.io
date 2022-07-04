const mobileMenu = document.querySelector('.mobile-menu');
const navList = document.querySelector('.nav-list');

mobileMenu.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
    navList.classList.toggle("active");
})
