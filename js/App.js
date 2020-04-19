let navigatorHelper = document.querySelector('.navigator-helper');

/**
 * Fixes the is-sticky class on headers.
 * @type {NodeListOf<Element>}
 */
let items = document.querySelectorAll('h1, h2');
let mainItems = [...items].filter(item => !item.closest('.sidebar'));
let percentageRead = document.querySelector('.percentage-read');
percentageRead.remove();

window.addEventListener('scroll', () => {
  let heightOfWindow = window.innerHeight;
  let contentScrolled = window.pageYOffset;
  let bodyHeight = window.document.getElementsByTagName("body")[0].offsetHeight;
  let total = bodyHeight - heightOfWindow;
  percentageRead.style.width = (Math.ceil(parseInt((contentScrolled/total) * 100))) + '%';

  let currentActive = [];
  mainItems.forEach(item => {
    if (item.getBoundingClientRect().top < 70) {
      currentActive.push(item);
    }

    item.classList.remove('is-sticky');
  });

  let lastItem = currentActive.length ? currentActive[currentActive.length - 1] : false;
  if (lastItem) {
    lastItem.classList.add('is-sticky');
    lastItem.appendChild(navigatorHelper);
    lastItem.appendChild(percentageRead);
    let currentIndex = [...mainItems].indexOf(lastItem);
    if (currentIndex === mainItems.length - 1) {
      navigatorHelper.classList.add('is-last');
    }
    else if (currentIndex === 0) {
      navigatorHelper.classList.add('is-first');
    }
    else {
      navigatorHelper.classList.remove('is-first');
      navigatorHelper.classList.remove('is-last');
    }
  }
  else {
    navigatorHelper.remove();
    percentageRead.remove();
  }
});

let scrollToPart = item => {
  if (window.outerWidth > 800) return;
  let firstPart = item.nextElementSibling;
  const y = firstPart.getBoundingClientRect().y + window.pageYOffset - 117;
  window.scrollTo({ top: y, behavior: 'smooth'});
};

mainItems.forEach(item => {
  item.addEventListener('click', event => {
    if (event.target === item) scrollToPart(item);
  });
});

let goUp = document.querySelector('.go-up');
let goDown = document.querySelector('.go-down');
let goIndex = document.querySelector('.go-index');

let goToPart = function (direction) {
  return function (event) {
    let header = event.target.closest('.is-sticky');
    let currentIndex = [...mainItems].indexOf(header);
    let next = [...mainItems][currentIndex + (direction === 'up' ? -1 : 1)];

    if (next) {
      scrollToPart(next);
    }
  }
};

goUp.addEventListener('click', goToPart('up'));
goDown.addEventListener('click', goToPart('down'));
navigatorHelper.remove();

goIndex.addEventListener('click', () => {
  document.documentElement.classList.add('show-index');
});

let indexPopup = document.querySelector('.index-popup');
items.forEach((item, index) => {
  let link = document.createElement('span');
  link.classList.add('index-link');
  link.innerHTML = item.innerHTML;
  link.querySelector('a').remove();

  if (index === 0) {
    link.innerText = 'Introductie';
  }

  let parent = item.closest('.sidebar') ? 'other' : 'main';

  if (parent === 'other') {
    let pointer = item.nextElementSibling;
    let groupItems = [];
    while (pointer) {
      if (pointer.nodeName !== 'H2') {
        groupItems.push(pointer.innerHTML);
      }
      pointer = pointer.nodeName === 'H2' ? null : pointer.nextElementSibling;
    }

    let wrapper = document.createElement('div');
    let group = document.createElement('div');
    wrapper.appendChild(link);
    wrapper.appendChild(group);
    group.classList.add('group');
    groupItems.forEach(groupItem => {
      let groupElement = document.createElement('p');
      groupElement.innerHTML = groupItem;
      group.appendChild(groupElement);
    });
    indexPopup.querySelector('.other').appendChild(wrapper);
    setTimeout(() => {
      group.oldHeight = group.clientHeight;
      group.style.height = 0;
    }, 100);

    link.addEventListener('click', () => {
      if (group.classList.contains('visible')) {
        link.classList.remove('active');
        group.style.height = 0;
        group.classList.remove('visible');
      }
      else {
        let activeItem = indexPopup.querySelector('.index-link.active');
        if (activeItem) {
          activeItem.click();
        }

        group.style.height = (group.oldHeight + 20) + 'px';
        group.classList.add('visible');
        link.classList.add('active');
        group.addEventListener('transitionend', () => {
          wrapper.scrollIntoView({
            behavior: 'smooth'
          });
        }, {
          once: true
        })
      }
    });
  }
  else {
    let itemInfo = document.createElement('span');
    itemInfo.classList.add('info');
    itemInfo.innerText = ((mainItems.indexOf(item) + 1).toString()) + '/' + mainItems.length;
    item.appendChild(itemInfo);

    link.addEventListener('click', () => {
      indexPopup.addEventListener('transitionend', () => {
        item.click();
      }, { once: true });
      document.documentElement.classList.remove('show-index');
    });
    indexPopup.querySelector('.main').appendChild(link);
  }
});

let closePopup = document.querySelector('.close-index-popup');

closePopup.addEventListener('click', () => {
  document.documentElement.classList.remove('show-index');
});

let readMores = document.querySelectorAll('.read-more');

readMores.forEach(readMore => {
  readMore.oldHeight = readMore.clientHeight;
  let button = readMore.querySelector('.read-more-toggle');
  readMore.style.height = '90px';

  button.addEventListener('click', () => {
    if (readMore.classList.contains('visible')) {
      readMore.classList.remove('visible');
      readMore.removeAttribute('style');
      readMore.style.height = '90px';
    }
    else {
      readMore.classList.add('visible');
      readMore.style.height = readMore.oldHeight + 'px';

    }
  });
});