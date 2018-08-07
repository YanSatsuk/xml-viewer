let errors = 0;
let warnings = 0;
let size = 0;
let xmlString = '';
const formMargin = '10px';
const btnWigth = '60px';
const hCenter = '0 auto';
const divWidth = '500px';
const marginTop = '20px';
const xmlLinkText = 'XML (0 in bytes)';
const errorLinkText = 'Errors (0)';
const warningLinkText = 'Warnings (0)';

const mainDiv = document.createElement('div');
mainDiv.style.width = '760px';
mainDiv.style.left = '50%';
mainDiv.style.position = 'absolute';
mainDiv.style.transform = 'translate(-50%)';
mainDiv.id = 'main';

const titleDiv = document.createElement('div');
titleDiv.style.textAlign = 'center';
titleDiv.id = 'title';

const title = document.createElement('h2');
title.appendChild(document.createTextNode('XML Viewer'));
title.style.cursor = 'move';
title.style.display = 'inline-block';
title.id = 'draggable';
titleDiv.appendChild(title);

const formDiv = document.createElement('div');
formDiv.style.width = divWidth;
formDiv.style.margin = hCenter;
formDiv.style.textAlign = 'left';

const pathInput = document.createElement('input');
pathInput.style.marginRight = formMargin;
pathInput.style.width = '250px';
pathInput.placeholder = 'Enter url';
pathInput.id = 'path-input';

const getBtn = document.createElement('button');
getBtn.innerHTML = 'Get';
getBtn.style.marginRight = formMargin;
getBtn.style.width = btnWigth;
getBtn.id = 'get-btn';
getBtn.addEventListener('click', request);

const postBtn = document.createElement('button');
postBtn.innerHTML = 'Post';
postBtn.style.width = btnWigth;
postBtn.id = 'post-btn';
postBtn.addEventListener('click', request);

formDiv.appendChild(pathInput);
formDiv.appendChild(getBtn);
formDiv.appendChild(postBtn);

const panelDiv = document.createElement('div');
panelDiv.appendChild(document.createTextNode('Views: '));
panelDiv.style.margin = hCenter;
panelDiv.style.marginTop = marginTop;
panelDiv.style.textAlign = 'left';
panelDiv.style.width = divWidth;
panelDiv.style.display = 'none';
panelDiv.id = 'panel';

const createLink = (linkText, id) => {
  const link = document.createElement('a');
  link.appendChild(document.createTextNode(linkText));
  link.href = '#';
  link.id = id;
  return link;
}

const xmlA = createLink(xmlLinkText, 'xml-link');
xmlA.addEventListener('click', () => {
  if (size) {
    xmlDiv.style.display = 'block';
    errorDiv.style.display = 'none';
    warningDiv.style.display = 'none';
  }
});

const errorA = createLink(errorLinkText, 'error-link');
errorA.addEventListener('click', () => {
  if (errors) {
    xmlDiv.style.display = 'none';
    errorDiv.style.display = 'block';
    warningDiv.style.display = 'none';
  }
});

const warningA = createLink(warningLinkText, 'warning-link');
warningA.addEventListener('click', () => {
  if (warnings) {
    xmlDiv.style.display = 'none';
    errorDiv.style.display = 'none';
    warningDiv.style.display = 'block';
  }
});

const statusElement = document.createElement('span');
statusElement.id = 'status';

panelDiv.appendChild(xmlA);
panelDiv.appendChild(document.createTextNode(' | '));
panelDiv.appendChild(errorA);
panelDiv.appendChild(document.createTextNode(' | '));
panelDiv.appendChild(warningA);
panelDiv.appendChild(document.createElement('br'));
panelDiv.appendChild(document.createTextNode('Status: '));
panelDiv.appendChild(statusElement);

const createDivView = (color, id) => {
  const div = document.createElement('div');
  div.style.border = `2px solid ${color}`;
  div.style.margin = hCenter;
  div.style.marginTop = marginTop;
  div.style.marginBottom = '20px';
  div.style.display = 'none';
  div.style.padding = '5px';
  div.className = 'xml';
  div.id = id;
  return div;
}

const xmlDiv = createDivView('blue', 'xml-view');
xmlDiv.addEventListener('click', collapseTag);

const errorDiv = createDivView('red', 'error-view');
const warningDiv = createDivView('yellow', 'warning-view');

mainDiv.appendChild(titleDiv);
mainDiv.appendChild(formDiv);
mainDiv.appendChild(panelDiv);
mainDiv.appendChild(xmlDiv);
mainDiv.appendChild(errorDiv);
mainDiv.appendChild(warningDiv);

document.body.appendChild(mainDiv);

dragDiv(document.getElementById('main'));

const xmlLink = document.getElementById('xml-link');
const errorLink = document.getElementById('error-link');
const warningLink = document.getElementById('warning-link');
const xmlView = document.getElementById('xml-view');
const errorView = document.getElementById('error-view');
const warningView = document.getElementById('warning-view');
const panel = document.getElementById('panel');
const status = document.getElementById('status');

function dragDiv(div) {
  let posX = 0;
  let posY = 0;
  const draggable = document.getElementById('draggable');

  if (draggable) {
    draggable.onmousedown = startDrag;
  }

  function startDrag(e) {
    posX = e.clientX;
    posY = e.clientY;
    document.onmousemove = move;
    document.onmouseup = remove;

    function move(e) {
      const newX = e.clientX - posX;
      const newY = e.clientY - posY;
      posX = e.clientX;
      posY = e.clientY;
      div.style.top = `${(div.offsetTop + newY)}px`;
      div.style.left = `${(div.offsetLeft + newX)}px`;
    }

    function remove(e) {
      document.onmousemove = null;
      document.onmouseup = null;
    }
  }
}

function request(e) {
  const value = document.getElementById('path-input').value.trim();
  if (value) {
    if (e.target.id == 'get-btn') {
      getXMLfromServer(value);
    } else {
      postXMLOnServer(value);
    }
  }
}

const postXMLOnServer = (path) => {
  const status = document.getElementById('status');
  let exist, ok, valid;
  exist = xmlString != '';
  ok = status.innerHTML == 'OK';
  valid = path.includes('http') || path.includes('https');
  if (exist && ok && valid) {
    fetch(path, {
      method: 'POST',
      headers: {
        "Accept": "application/xml, text/xml",
        "Content-Type": "application/xml, text/xml"
      },
      body: xmlString
    }).then(res => res.json()).then(res => {
      console.log(res);
    }).catch(error => console.log(error));
  }
}

const getXMLfromServer = (path) => {
  errors = 0;
  warnings = 0;
  panel.style.display = 'block';
  if (path.includes('http') || path.includes('https')) {
    fetch(path).then(res => {
      if (res.status == 200) {
        const type = res.headers.get("content-type");
        if (type == 'application/xml' || type == 'text/xml') {
          status.innerHTML = 'OK';
          return res.text();
        } else {
          status.innerHTML = 'INCORRECT DATA';
          return null;
        }
      } else {
        status.innerHTML = 'BAD REQUEST';
        return null;
      }
    }).then(xml => {
      if (xml !== null) {
        xmlString = xml;
        renderXMLInfo(xml);
      }
    }).catch(error => {
      console.log(error);
      status.innerHTML = 'BAD REQUEST';
    });;
  } else {
    status.innerHTML = 'BAD ADDRESS';
  }
}

const renderXMLInfo = (xml) => {
  const xmlDoc = new DOMParser().parseFromString(xml, 'text/xml');
  size = new Blob([xml], { type: 'text/xml' }).size;
  xmlLink.innerHTML = `XML (${size} in bytes)`;
  xmlView.innerHTML = '';
  xmlView.style.display = 'block';
  resetDiv(errorView);
  resetDiv(warningDiv);
  const xmlinfo = document.createElement('div');
  xmlinfo.style.marginLeft = '10px';
  xmlinfo.innerHTML = `&lt?xml version="${xmlDoc.xmlVersion}" encoding="${xmlDoc.xmlEncoding}" ?&gt`;
  xmlView.appendChild(xmlinfo);
  renderXMLView(xmlDoc, xmlView);
}

const resetDiv = (div) => {
  div.innerHTML = '';
  div.style.display = 'none';
}

const renderXMLView = (xml, div) => {
  for (let i = 0; i < xml.children.length; i++) {
    const collapse = document.createElement('div');
    collapse.innerHTML = '-';
    collapse.style.position = 'absolute';
    collapse.style.cursor = 'pointer';
    collapse.className = 'collapsible';

    const parent = document.createElement('div');
    parent.className = 'parent';
    parent.style.marginLeft = '10px';

    const children = document.createElement('div');
    children.style.display = 'block';
    children.className = 'children';

    let atr = '';
    if (xml.children[i].attributes.length) {
      for (let x = 0; x < xml.children[i].attributes.length; x++) {
        atr += ` <span class='xml-attribute'>${xml.children[i].attributes[x].nodeName}</span>="${xml.children[i].attributes[x].nodeValue}"`;
      }
    }

    if (xml.children[i].childElementCount > 0) {
      div.appendChild(collapse);
      parent.innerHTML += `<span class='xml-parent'>&lt${xml.children[i].nodeName}${atr}&gt</span>`;
      div.appendChild(parent);
      parent.appendChild(children);

      renderXMLView(xml.children[i], children);

      const closeParent = document.createElement('div');
      children.appendChild(closeParent).innerHTML += `<span class='xml-parent'>&lt/${xml.children[i].nodeName}&gt</span>`;
    } else {
      const child = document.createElement('div');
      child.style.marginLeft = '10px';
      child.className = 'child';
      const node = xml.children[i].nodeName;
      if (node.toLowerCase() == 'error') {
        errorLink.innerHTML = `Errors (${++errors})`;
        child.innerHTML = hasTextContent(xml.children[i], atr);
        errorView.appendChild(child);
      } else if (node.toLowerCase() == 'warning') {
        warningLink.innerHTML = `Warnings (${++warnings})`;
        child.innerHTML = hasTextContent(xml.children[i], atr);
        warningView.appendChild(child);
      } else {
        child.innerHTML = hasTextContent(xml.children[i], atr);
        div.appendChild(child);
      }
    }
  }
}

const hasTextContent = (xmlChild, atr) => {
  if (xmlChild.textContent == '') {
    return `<span class='xml-tag'>&lt${xmlChild.nodeName}</span>${atr}<span class='xml-tag'>/&gt</span>`;
  } else {
    return `<span class='xml-tag'>&lt${xmlChild.nodeName}</span>${atr}<span class='xml-tag'>&gt</span>${xmlChild.textContent}<span class='xml-tag'>&lt/${xmlChild.nodeName}&gt</span><br>`;
  }
}

function collapseTag(event) {
  if (event.target.className == 'collapsible') {
    if (event.target.innerText == '+') {
      event.target.innerText = '-';
    } else {
      event.target.innerText = '+';
    }
    if (event.target.nextSibling.firstElementChild.nextSibling.style.display == 'block') {
      event.target.nextSibling.firstElementChild.nextSibling.style.display = 'none';
    } else {
      event.target.nextSibling.firstElementChild.nextSibling.style.display = 'block';
    }
  }
}
