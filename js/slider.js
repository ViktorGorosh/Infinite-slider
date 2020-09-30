"use strict";

// конфигурация
let step = 0; //начальное положение слайдера
let width = 130; //ширина одной картинки
let animationDuration = 1000; //продолжительность анимации
let frameTime = 20 //время кадра анимации
let currentTransform = 0; //текущее значение сдвига

let slider = document.querySelector('.slider');
let slides = document.querySelectorAll('.slide');
let dots = document.querySelector('.dots');
let isAnimating = false;

function initSlider() {
	for (let i = 0; i < slides.length; i++) {
		slides[i].dataset.count = i;
		let newDot = document.createElement('li');
		newDot.classList.add('dot');
		newDot.dataset.count = i;
		dots.append(newDot);
	}
	dots.firstElementChild.classList.add('active');
	slider.style.transform = 'translateX(' + currentTransform + 'px)';
	document.querySelector('.next').onclick = next;
	document.querySelector('.prev').onclick = prev;
	dots.onclick = goToSomeSlide;

	// Отдельныый случай для слайдера с одним изображением
	if (slides.length == 1) {
		slider.prepend(slider.firstElementChild.cloneNode(true));
		slider.append(slider.firstElementChild.cloneNode(true));
		currentTransform = -width;
		slider.style.transform = 'translateX(' + currentTransform + 'px)';
	}
}

function next() {
	// Отключаем обработчики
	if (isAnimating) return;
	isAnimating = true;

	// Меняем порядок элементов, если находимся на последнем слайде
	if (slider.lastElementChild.classList.contains('active')) {
		currentTransform += width;
		slider.style.transform = 'translateX(' + currentTransform + 'px)';
		slider.append(slider.firstElementChild);
	} 

	// Меняем активный слайд
	let oldSlide = slider.querySelector('.active')
	oldSlide.nextElementSibling.classList.add('active');
	oldSlide.classList.remove('active');

	step = oldSlide.nextElementSibling.dataset.count;

	// Меняем активную кнопку
	dots.querySelector('.active').classList.remove('active');
	dots.querySelectorAll('.dot')[step].classList.add('active');

	// анимация прокрутки
	let expectedTransform = currentTransform - width;
	let animation = setInterval(function () {
		currentTransform -= width / animationDuration * frameTime;
		slider.style.transform = 'translateX(' + currentTransform + 'px)';
	}, frameTime);

	setTimeout(function () {
		clearInterval(animation);

		// пододвигаем изображение точно
		if (expectedTransform != currentTransform) {
			currentTransform = expectedTransform;
			slider.style.transform = 'translateX(' + currentTransform + 'px)';
		}

		isAnimating = false;
	}, animationDuration);
}

function prev() {
	// Отключаем обработчики
	if (isAnimating) return;
	isAnimating = true;

	if (slider.firstElementChild.classList.contains('active')) {
		currentTransform -= width;
		slider.style.transform = 'translateX(' + currentTransform + 'px)';
		slider.prepend(slider.lastElementChild);
	}

	let oldSlide = slider.querySelector('.active')
	oldSlide.previousElementSibling.classList.add('active');
	oldSlide.classList.remove('active');

	step = oldSlide.previousElementSibling.dataset.count;

	// Меняем активную кнопку
	dots.querySelector('.active').classList.remove('active');
	dots.querySelectorAll('.dot')[step].classList.add('active');

	// анимация прокрутки
	let expectedTransform = currentTransform + width;
	let animation = setInterval(function () {
		currentTransform += width / animationDuration * frameTime;
		slider.style.transform = 'translateX(' + currentTransform + 'px)';
	}, frameTime);

	setTimeout(function () {
		clearInterval(animation);
		isAnimating = false;

		// пододвигаем изображение точно
		if (expectedTransform != currentTransform) {
			currentTransform = expectedTransform;
			slider.style.transform = 'translateX(' + currentTransform + 'px)';
		}

	}, animationDuration);
}

function goToSomeSlide() {
	
	// Если клик не по точке, не по активной точке или уже запущена анимация - не обрабатываем
	if (!event.target.classList.contains('dot') || event.target.classList.contains('active') || isAnimating) return;

	isAnimating = true;
	let newStep = +event.target.dataset.count;

	// Ветка для движения вправо
	if (newStep > step) {

		// Передвигаем элементы вправо
		let counter = 0;

		while(slider.firstElementChild.dataset.count != step) {
			slider.append(slider.firstElementChild);
			counter++;
		}

		if (counter > 0) {
			currentTransform += counter * width;
			slider.style.transform = 'translateX(' + currentTransform + 'px)';
		}
		
		// Меняем активный слайд
		slider.querySelector('.active').classList.remove('active');
		slider.querySelector(`[data-count="${newStep}"]`).classList.add('active')

		// Меняем активную кнопку
		dots.querySelector('.active').classList.remove('active');
		dots.querySelectorAll('.dot')[newStep].classList.add('active');

		// анимация прокрутки
		let expectedTransform = currentTransform - (newStep - step) * width;
		let animation = setInterval(function () {
			currentTransform -= (newStep - step) * width / animationDuration * frameTime;
			slider.style.transform = 'translateX(' + currentTransform + 'px)';
		}, frameTime);

		setTimeout(function () {
			clearInterval(animation);
			step = newStep;

			// пододвигаем изображение точно
			if (expectedTransform != currentTransform) {
				currentTransform = expectedTransform;
				slider.style.transform = 'translateX(' + currentTransform + 'px)';
			}

			isAnimating = false;
		}, animationDuration);

	// Ветка для движения влево
} else {

		// Передвигаем элементы влево
		let counter = 0;

		while(slider.lastElementChild.dataset.count != step) {
			slider.prepend(slider.lastElementChild);
			counter++;
		}

		currentTransform -= counter * width;
		slider.style.transform = 'translateX(' + currentTransform + 'px)';

		// Меняем активный слайд
		slider.querySelector('.active').classList.remove('active');
		slider.querySelector(`[data-count="${newStep}"]`).classList.add('active');

		// Меняем активную кнопку
		dots.querySelector('.active').classList.remove('active');
		dots.querySelectorAll('.dot')[newStep].classList.add('active');

		// анимация прокрутки
		let expectedTransform = currentTransform - (newStep - step) * width;
		let animation = setInterval(function () {
			currentTransform -= (newStep - step) * width / animationDuration * frameTime;
			slider.style.transform = 'translateX(' + currentTransform + 'px)';
		}, frameTime);

		setTimeout(function stopAnimation() {
			clearInterval(animation);
			step = newStep;

			// пододвигаем изображение точно
			if (expectedTransform != currentTransform) {
				currentTransform = expectedTransform;
				slider.style.transform = 'translateX(' + currentTransform + 'px)';
			}

			isAnimating = false;
		}, animationDuration);
	}
}

initSlider();