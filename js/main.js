import data from './data.js';

/* Initialization */

let currentPlanet = data[0];
animateElement(document.querySelector('.main__illustration-planet'), 'animation-illustration-planet');
for (const parameter of document.querySelectorAll('[data-parameter]')) animateElement(parameter, 'animation-parameter');

/* Content change */

function updateCurrentPlanet(chosenPlanetName) {
    currentPlanet = data.find((planet) => planet.name === chosenPlanetName);
}

function removeAnimationMobileMenu() {
    document.querySelectorAll('.header__menu-item').forEach((item) => {
        item.classList.remove('animation-mobile-menu');
    });
    header.classList.remove('header--open');
}

function handleMenuItemClick(event) {
    event.preventDefault();

    document.body.className = `body body--${event.target.dataset.planet}`;
    const chosenPlanetName = event.target.dataset.planet.slice(0, 1).toUpperCase() + event.target.dataset.planet.slice(1);
    updateCurrentPlanet(chosenPlanetName);
    setParameters();
    resetActiveTab(document.querySelector('[data-section="overview"]'));
    setContent('overview');
    removeAnimationMobileMenu();
}

function handleBurgerButtonClick(event) {
    event.preventDefault();

    if (!header.classList.contains('header--open')) {
        header.classList.add('header--open');

        document.querySelectorAll('.header__menu-item').forEach((item, index) => {
            const animationDelay = 30;
            setTimeout(() => {
                item.classList.add('animation-mobile-menu');
            }, animationDelay * index);
        });
    } else {
        removeAnimationMobileMenu();
    }
}

function resetActiveTab(newTab) {
    const currentTab = document.querySelector('.tab--active');
    currentTab.classList.remove('tab--active');
    newTab.classList.add('tab--active');
}

function handleTabButtonClick(event) {
    event.preventDefault();

    resetActiveTab(event.target);
    setContent(event.target.dataset.section);
}

function animateElement(element, animationClass) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.bottom < windowHeight) {
        element.classList.add(animationClass);
        element.offsetWidth;

        setTimeout(() => {
            requestAnimationFrame(() => {
                element.classList.remove(animationClass);
            });
        }, 1000);
    } else {
        const scrollHandler = () => {
            if (element.getBoundingClientRect().top < windowHeight) {
                element.classList.add(animationClass);
                element.offsetWidth;

                setTimeout(() => {
                    requestAnimationFrame(() => {
                        element.classList.remove(animationClass);
                    });
                }, 1000);

                window.removeEventListener('scroll', scrollHandler);
            }
        };

        window.addEventListener('scroll', scrollHandler);
    }
}

function setContent(section) {
    const chosenSection = currentPlanet[section];
    const illustrationWrapper = document.querySelector('.main__illustration-wrapper');

    illustrationWrapper.lastElementChild.src = currentPlanet.images.geology;

    if (section === 'geology') {
      illustrationWrapper.classList.add('main__illustration-wrapper--geology');
      illustrationWrapper.firstElementChild.src = currentPlanet.images.planet;
      animateElement(illustrationWrapper.lastElementChild, 'animation-illustration-surface');
    } else {
      illustrationWrapper.classList.remove('main__illustration-wrapper--geology');
      illustrationWrapper.firstElementChild.src = (section === 'overview') ? currentPlanet.images.planet : currentPlanet.images.internal;
    }

    illustrationWrapper.firstElementChild.alt = `Planet ${currentPlanet.name}`;

    document.querySelector('.main__title').textContent = currentPlanet.name;
    document.querySelector('.main__excerpt').textContent = chosenSection.content;
    document.querySelector('.main__source-link').href = chosenSection.source;

    animateElement(illustrationWrapper.firstElementChild, 'animation-illustration-planet');
}

function setParameters() {
    for (const parameter of document.querySelectorAll('[data-parameter]')) {
        if (parameter.dataset.parameter === 'temperature') {
            parameter.textContent = currentPlanet.temperature;
        } else {
            const [value, unit] = currentPlanet[parameter.dataset.parameter].split(' ');
            parameter.firstElementChild.textContent = value;
            parameter.lastElementChild.textContent = unit;
        }
        animateElement(parameter, 'animation-parameter');
    }
}

const menuButtons = document.querySelectorAll('[data-planet]');
menuButtons.forEach((menuButton) => {
    menuButton.addEventListener('click', handleMenuItemClick);
});

const header = document.querySelector('.header');
const burgerButton = document.querySelector('.header__button');
burgerButton.addEventListener('click', handleBurgerButtonClick);

const tabButtons = document.querySelectorAll('.main__tab');
tabButtons.forEach((tabButton) => {
    tabButton.addEventListener('click', handleTabButtonClick);
});

/* Shorter tab names for mobile */

const mediaQuery = window.matchMedia('(max-width: 688px)');

function updateTabText(tab, dataAttribute) {
    tab.textContent = tab.dataset[dataAttribute];
}

function handleMediaQueryChange(event) {
    document.querySelectorAll('[data-section]').forEach(function(tab) {
        if (event.matches) {
            updateTabText(tab, 'shortName');
        } else {
            updateTabText(tab, 'fullName');
        }
    });
}

mediaQuery.addEventListener('change', handleMediaQueryChange);
handleMediaQueryChange(mediaQuery);