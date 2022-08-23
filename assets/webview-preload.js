const { ipcRenderer } = require('electron');

//////////////////////////
// Whatsapp
//////////////////////////
async function unregisterServiceWorkers() {
  const registrations = await window.navigator.serviceWorker.getRegistrations();
  for (const registration of registrations) {
    registration.unregister();
  }
}

function isWhatsappLoadFailed() {
  const titleEl = document.querySelector('.landing-title');
  return titleEl && titleEl.innerHTML.includes('Google Chrome');
}

//////////////////////////
// Chrome Extensiosn
//////////////////////////
const injectChromeWebstoreInstallButton = () => {
  const ibText = 'Add to BonBon';
  const ibTemplate =
    '<div role="button" class="dd-Va g-c-wb g-eg-ua-Uc-c-za g-c-Oc-td-jb-oa g-c" aria-label="' +
    ibText +
    '" tabindex="0" style="user-select: none;"><div class="g-c-Hf"><div class="g-c-x"><div class="g-c-R  webstore-test-button-label">' +
    ibText +
    '</div></div></div></div>';

  const waitForCreation = (selector, callback) => {
    const element = document.querySelector(selector);
    if (element != null) {
      callback(element);
    } else {
      setTimeout(() => {
        waitForCreation(selector, callback);
      }, 50);
    }
  };

  waitForCreation('.h-F-f-k.F-f-k', (element) => {
    element.addEventListener('DOMNodeInserted', (event) => {
      if (event.relatedNode != element) return;

      setTimeout(() => {
        installButton(event.target.querySelector('.h-e-f-Ra-c.e-f-oh-Md-zb-k'));
      }, 10);
    });
  });

  document.addEventListener('DOMNodeInserted', (event) => {
    setTimeout(() => {
      Array.from(document.getElementsByClassName('a-na-d-K-ea')).forEach(
        (el) => {
          el.parentNode?.removeChild(el);
        }
      );
    }, 10);
  });

  const installPlugin = (id) => {
    const button = document.getElementsByClassName(
      'webstore-test-button-label'
    )[0];
    button.innerHTML = 'Installing...';

    setTimeout(() => {
      button.innerHTML = 'Installed';
    }, 3000);

    ipcRenderer.sendToHost('install-extension', id);
  };

  const installButton = (wrapper) => {
    if (wrapper == null) return;
    const idArray = document.URL.match(/(?<=\/)(\w+)(\?|$)/);
    if (idArray && idArray[1]) {
      wrapper.innerHTML += ibTemplate;
      const DOM = wrapper.children[0];

      /* Styling */
      DOM.addEventListener('mouseover', () => {
        DOM.className =
          'dd-Va g-c-wb g-eg-ua-Uc-c-za g-c-0c-td-jb-oa g-c g-c-l';
      });
      DOM.addEventListener('mouseout', () => {
        DOM.className = 'dd-Va g-c-wb g-eg-ua-Uc-c-za g-c-Oc-td-jb-oa g-c';
      });
      DOM.addEventListener('mousedown', () => {
        DOM.className =
          'dd-Va g-c-wb g-eg-ua-Uc-c-za g-c-Oc-td-jb-oa g-c g-c-Xc g-c-Sc-ci g-c-l g-c-Bd';
      });
      DOM.addEventListener('mouseup', () => {
        DOM.className =
          'dd-Va g-c-wb g-eg-ua-Uc-c-za g-c-0c-td-jb-oa g-c g-c-l';
      });
      DOM.addEventListener('click', () => {
        installPlugin(idArray[1]);
      });
    }
  };
};

const keyUpListener = (e) => {
  if (e.key === 'Alt') {
    ipcRenderer.sendToHost('AltUp');
  }
};

const keyDownListener = (e) => {
  if (e.key === 'Alt') {
    ipcRenderer.sendToHost('AltDown');
  }
  if (e.ctrlKey && !e.shiftKey && e.key === 'Tab') {
    ipcRenderer.sendToHost('ctrl+Tab');
  }

  if (e.ctrlKey && e.shiftKey && e.key === 'Tab') {
    ipcRenderer.sendToHost('ctrl+shift+Tab');
  }

  if (e.ctrlKey && !e.shiftKey && e.key === 't') {
    ipcRenderer.sendToHost('ctrl+t');
  }

  if (e.ctrlKey && e.shiftKey && e.key === 'T') {
    ipcRenderer.sendToHost('ctrl+shift+T');
  }

  if (e.ctrlKey && !e.shiftKey && e.key === 'r') {
    ipcRenderer.sendToHost('ctrl+r');
  }

  if (e.ctrlKey && !e.shiftKey && e.key === 'w') {
    ipcRenderer.sendToHost('ctrl+w');
  }

  if (e.ctrlKey && e.shiftKey && e.key === 'W') {
    ipcRenderer.sendToHost('ctrl+shift+W');
  }

  if (e.ctrlKey && !e.shiftKey && e.key === 'f') {
    ipcRenderer.sendToHost('ctrl+f');
  }
};

ipcRenderer.on('created-webcontents', (e, args) => {
  ipcRenderer.sendToHost('created-webcontents', args);
});

document.addEventListener(
  'DOMContentLoaded',
  () => {
    window.addEventListener('click', () => {
      ipcRenderer.sendToHost('clickOnPage');
    });

    window.addEventListener('mouseup', () => {
      ipcRenderer.sendToHost('mouseup');
    });

    window.addEventListener('keydown', keyDownListener, false);
    window.addEventListener('keyup', keyUpListener, false);
  },
  false
);

if (window.location.host === 'chrome.google.com') {
  injectChromeWebstoreInstallButton();
}

window.onload = async () => {
  if (window.location.host === 'web.whatsapp.com') {
    if (isWhatsappLoadFailed()) {
      await unregisterServiceWorkers();
      window.location.reload();
    }
  }
};
