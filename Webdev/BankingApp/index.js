'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav  = document.querySelector('.nav');


const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});



//Button Scrolling
const btnScrollTo = document.querySelector('.btn--scroll-to');

const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function(e){
  section1.scrollIntoView({behavior: 'smooth'});
})


//Page navigation


// document.querySelectorAll('.nav__link').forEach(function(el){
//   el.addEventListener('click', function(e){
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({behavior: 'smooth'});
//   })
// })

// 1. add event Listener to common parent
// 2. determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function(e){
  e.preventDefault();
  if (e.target.classList.contains('nav__link')){
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  };
});



// Tabbed component


tabsContainer.addEventListener('click', function(e){
  const clicked = e.target.closest('.operations__tab');
  if(!clicked) return;
  tabs.forEach(t=> t.classList.remove("operations__tab--active"));
  clicked.classList.add("operations__tab--active");


  tabsContent.forEach(c => c.classList.remove('operations__content--active'))
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});


// Menu fade animation


const handleOver = function(e){
  if(e.target.classList.contains('nav__link')){
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if(el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }

}

nav.addEventListener('mouseover',handleOver.bind(0.5));
nav.addEventListener('mouseout', handleOver.bind(1));



// Sticky navigation: Intersection Observer API



const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickynav = function(entries){
  const [entry] = entries;

  if(!entry.isIntersecting){
    nav.classList.add('sticky');
  }else{
    nav.classList.remove('sticky');
  }

}

const headerObserver = new IntersectionObserver(stickynav, {
  root: null, 
  threshold: 0,
  rootMargin: `${navHeight}px`
});

headerObserver.observe(header);


//Reveal sections

const allSections = document.querySelectorAll('.section');

const reveaSection = function(entries, observer){
  entries.forEach(entry =>{
    if(!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  });
}

const sectionObserver = new IntersectionObserver
(reveaSection, {
  root: null, 
  threshold: 0.15
});
allSections.forEach(function(section){
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});


//Lazy loading imgs

const loadimg = function(entries, observer){
  const [entry] = entries;

  if(!entry.isIntersecting) return;


  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function(){
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);

}

const imgTargets = document.querySelectorAll('img[data-src]');

const imgObserver = new IntersectionObserver(loadimg,{
  root: null,
  threshold: 0,

});

imgTargets.forEach(function(img){
  imgObserver.observe(img);
});

//Slider

const slides = document.querySelectorAll('.slide');

const leftBtn = document.querySelector('.slider__btn--left');
const rightBtn = document.querySelector('.slider__btn--right');
const dots = document.querySelector('.dots');

const createDots = function(){
  slides.forEach((_, i) => {
    dots.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}">
      </button>`);
  })
};

createDots();
const activeDot = function(slide){
  document.querySelectorAll('.dots__dot').forEach(e =>{
    e.classList.remove('dots__dot--active');
  });
  document.querySelector(`.dots__dot[data-slide = "${slide}"]`).classList.add('dots__dot--active');
}



let curSlide = 0;
const maxSlide = slides.length;

const goToSlide = function(slide){
  slides.forEach((s, i) =>{
    s.style.transform = `translateX(${100*(i-slide)}%)`;
  })
};
goToSlide(0);
activeDot(0);


const nextSlide = function(){
  if(curSlide === maxSlide-1){
    curSlide = 0;
  }else{
    curSlide++;
  }
  goToSlide(curSlide);
  activeDot(curSlide);
}

const prevSlide = function(){
  if(curSlide === 0){
    curSlide = maxSlide - 1;
  }
  else{
    curSlide--;
  }
  goToSlide(curSlide);
  activeDot(curSlide);
}

rightBtn.addEventListener('click', nextSlide);
leftBtn.addEventListener('click', prevSlide);
dots.addEventListener('click', function(e){
  if(e.target.classList.contains('dots__dot')){
    curSlide = Number(e.target.dataset.slide);
    goToSlide(curSlide);
    activeDot(curSlide);
  }
})

