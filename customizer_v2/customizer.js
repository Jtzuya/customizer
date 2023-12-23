window.addEventListener('DOMContentLoaded', init)

function init() {
    const canvasDisplayContainer = document.getElementById('ActivityDIV')
    const colorsDisplayContainer = document.querySelector('.customizer__colors')
    let currentColor = '#ffffff'
    
    canvasDisplayContainer.innerHTML = svgArr[0].source // init state

    setupVariants(canvasDisplayContainer)
    setupColors(colorsDisplayContainer, canvasDisplayContainer, currentColor)
    clearColor(canvasDisplayContainer)

    document.getElementById('prepImage').addEventListener('click', function(e) {
        e.preventDefault()
        e.target.textContent = 'Loading...'
        generateImage(e, canvasDisplayContainer)
    })
}


function setupVariants(canvasDisplayContainer) {
    let ul = document.querySelector('.menu__extension')

    svgArr.forEach(i => {
        let li = document.createElement('li')
        li.classList.add('menu__item')
        li.setAttribute('data-src', i.source)
        li.setAttribute('data-variant-name', i.name)
        li.textContent = i.name

        li.addEventListener('click', function(e) { 
            e.preventDefault()
            document.querySelector('.label-variant').innerHTML = i.name
            variantChangeHandler(e, canvasDisplayContainer) 
        })

        ul.appendChild(li)
    })
}

function variantChangeHandler(e, canvasDisplayContainer) {
    canvasDisplayContainer.innerHTML = e.target.getAttribute('data-src')
}

function setupColors(colorsDisplayContainer, canvasDisplayContainer, currentColor) {
    const colorsArr = [
        {
            "name": "Black",
            "color": "#000000"
        },
        {
            "name": "Dark Navy",
            "color": "#022C4E"
        },
        {
            "name": "Purple",
            "color": "#3E1865"
        },
        {
            "name": "Dark Blue",
            "color": "#0754A5"
        },
        {
            "name": "Light Blue",
            "color": "#59B5E6"
        },
        {
            "name": "Grey",
            "color": "#647A83"
        },
        {
            "name": "Green",
            "color": "#027F60"
        },
        {
            "name": "Ocean Blue",
            "color": "#0097A3"
        },
        {
            "name": "Red",
            "color": "#E31A3F"
        },
        {
            "name": "Gold",
            "color": "#F59A2D"
        },
        {
            "name": "Yellow",
            "color": "#F4F226"
        },
        {
            "name": "Natural",
            "color": "#E7EAEA"
        },
    ]

    colorsArr.forEach(i => {
        let li = document.createElement('li')
        let span = document.createElement('span')

        li.classList.add('customizer__color')
        li.setAttribute('title', i.name)
        li.setAttribute('data-color', i.color)
        li.setAttribute('data-color-name', i.name)

        span.classList.add('customizer__color-name')
        span.textContent = i.name

        li.style.backgroundColor = i.color
        li.append(span)
        li.addEventListener('click', function(e) {
            colorChangeHandler(e, canvasDisplayContainer, currentColor)
        })

        colorsDisplayContainer.appendChild(li)
    })
}

function colorChangeHandler(e, canvasDisplayContainer, currentColor) {
    e.preventDefault()
    document.querySelector('.label-color').innerHTML = e.target.getAttribute('data-color-name')
    currentColor = e.target.getAttribute('data-color')

    let paths = canvasDisplayContainer.querySelectorAll('path')

    paths.forEach(i => {
        i.addEventListener('click', function(e) {
            e.target.style.fill = currentColor
        })
    })
}

function clearColor(canvasDisplayContainer) {
    document.getElementById('btnClear').addEventListener('click', function(e) {
        e.preventDefault()
        let paths = canvasDisplayContainer.querySelectorAll('path')
        paths.forEach(i => i.style.fill = 'transparent')
    })
}

function generateImage(e, canvasDisplayContainer) {
    let output = ''
    const svg = canvasDisplayContainer.lastElementChild

    const svgData =  new XMLSerializer().serializeToString(svg)
    const svgDataBase64 = btoa(unescape(encodeURIComponent(svgData)))
    const svgDataUrl = `data:image/svg+xml;charset=utf-8;base64,${svgDataBase64}`

    const image = new Image()

    image.addEventListener('load', () => {
        const width = svg.getAttribute('width')
        const height = svg.getAttribute('height')
        const canvas = document.createElement('canvas')
    
        canvas.setAttribute('width', width)
        canvas.setAttribute('height', height)
    
        const context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, width, height)
    
        const dataUrl = canvas.toDataURL('image/png')
        output = dataUrl
    })

    image.src = svgDataUrl

    setTimeout(() => {dataURIToBlob(e, output, blobCallback)}, 500)
}

function dataURIToBlob(e, dataURI, callback) {
    var binStr = atob(dataURI.split(',')[1]),
    len = binStr.length,
    arr = new Uint8Array(len);

    for (var i = 0; i < len; i++) {
        arr[i] = binStr.charCodeAt(i);
    }

    callback(e, new Blob([arr]));
}

function blobCallback(e, blob) {
    var downloadBtn = document.createElement('a');
    downloadBtn.download = 'customized-output.png';
    // the string representation of the object URL will be small enough to workaround the browser's limitations
    downloadBtn.href = URL.createObjectURL(blob);
    // console.log('link:', downloadBtn)
    // you must revoke the object URL, 
    //   but since we can't know when the download occured, we have to attach it on the click handler..

    downloadBtn.click();
    e.target.textContent = 'Download'
};