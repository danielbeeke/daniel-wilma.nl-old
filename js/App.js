let navigatorHelper = document.querySelector('.navigator-helper');

/**
 * Fixes the is-sticky class on headers.
 * @type {NodeListOf<Element>}
 */
let items = document.querySelectorAll('h1, h2');

let mainItems = [...items].filter(item => !item.closest('.sidebar') && !item.closest('.hide-on-mobile'));
let percentageRead = document.querySelector('.percentage-read');
if (percentageRead) {
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
}

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

if (goUp) {
  goUp.addEventListener('click', goToPart('up'));
  goDown.addEventListener('click', goToPart('down'));
  navigatorHelper.remove();

  goIndex.addEventListener('click', () => {
    document.documentElement.classList.add('show-index');
  });
}

let indexPopup = document.querySelector('.index-popup');
items.forEach((item, index) => {
  if (item.closest('.hide-on-mobile')) return;

  let link = document.createElement('span');
  link.classList.add('index-link');
  link.innerHTML = item.innerHTML;
  let innerLink = link.querySelector('a')

  if (innerLink)   link.querySelector('a').remove();

  if (index === 0) {
    link.innerText = 'Introductie';
  }

  let parent = item.closest('.sidebar') ? 'other' : 'main';

  if (parent === 'other') {
    let pointer = item.nextElementSibling;
    let groupItems = [];
    while (pointer) {
      if (pointer.nodeName !== 'H2') {
        if (pointer.nodeName === 'UL') {
          groupItems.push('<ul>' + pointer.innerHTML + '</ul>');
        }
        else {
          groupItems.push(pointer.innerHTML);
        }
      }
      pointer = pointer.nodeName === 'H2' ? null : pointer.nextElementSibling;
    }

    let wrapper = document.createElement('div');
    let group = document.createElement('div');
    wrapper.appendChild(link);
    wrapper.appendChild(group);
    group.classList.add('group');
    group.dataset.name = link.innerText;
    groupItems.forEach(groupItem => {
      let groupElement = document.createElement('p');
      groupElement.innerHTML = groupItem;
      group.appendChild(groupElement);
    });
    indexPopup.querySelector('.other .list').appendChild(wrapper);
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
    indexPopup.querySelector('.main .list').appendChild(link);
  }
});

let closePopup = document.querySelector('.close-index-popup');

if (closePopup) {
  closePopup.addEventListener('click', () => {
    document.documentElement.classList.remove('show-index');
  });
}

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

let donateButton = document.querySelector('#Helpt-u-mee');
if (donateButton) {
  donateButton.addEventListener('click', (event) => {
    event.preventDefault();
    let menuItems = document.querySelectorAll('.other .index-link');
    let menuItem = menuItems[menuItems.length - 1];
    if (!menuItem.classList.contains('active')) menuItem.click();
    let rect = menuItem.getBoundingClientRect();
    goIndex.click();
  });
}

// Frontpage code.

let isFrontpage = document.querySelector('.frontpage');

if (isFrontpage) {
  let tabLinks = document.querySelectorAll('.f-tab-link');
  tabLinks.forEach(tabLink => {
    tabLink.addEventListener('click', event => {
      event.preventDefault()

      let activeTabs = document.querySelectorAll('.f-tab-content.active')
      activeTabs.forEach(activeTab => activeTab.classList.remove('active'))
      let activeTabLinks = document.querySelectorAll('.f-tab-link.active')
      activeTabLinks.forEach(activeTabLink => activeTabLink.classList.remove('active'))
      tabLink.classList.add('active')

      let tab = document.querySelector(`#${tabLink.dataset.tab}.f-tab-content`)
      tab.classList.add('active')
    });
  });
}

let newsletterToggles = document.querySelectorAll('.f-toggle-newsletter-archive');

if (newsletterToggles.length) {
  let close = document.querySelector('.f-newsletter-archive .f-close');

  let newsletterToggleEvent = event => {
    let newsletterArchive = document.querySelector('.f-newsletter-archive')
    newsletterArchive.classList.toggle('active')
    event.preventDefault()
  }

  newsletterToggles.forEach(newsletterToggle => newsletterToggle.addEventListener('click', newsletterToggleEvent))

  close.addEventListener('click', newsletterToggleEvent)
}
