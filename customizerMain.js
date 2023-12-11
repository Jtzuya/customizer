let HOLDER = {
    main: null,
    color: null,
}

let Button = {
    random: null,
    clear: null,
    downloadSVG: null,
    downloadPN: null
}

let SVG = {
    object: null,
    outline: null,
    color: null
}

let options = {
    colors: ['#FFFFFF', '#8E53A1', '#6ABD46', '#71CCDC', '#F7ED45', '#F7DAAF']
}

let chosenColor = '';
let closeOffset;
let output = '';

document.addEventListener('mouseover', pathFill)

let toCustomizeFrames = document.querySelectorAll('[data-customizer-frame]')
toCustomizeFrames.forEach(i => {
    i.addEventListener('click', prototypeChange)
})

function prototypeChange(el) {
    let toAttachElement = el.target.lastElementChild
    let clone = toAttachElement.cloneNode(true)
    let frameToAttach = document.getElementById('ActivityDIV')
    frameToAttach.innerHTML = ""
    frameToAttach.appendChild(clone)
}

// const colorSwatch = document.getElementsByClassName('colors')[0]
const colorSwatch = document.getElementsByClassName('customizer__colors')[0]
colorSwatch.innerHTML = displayColor()

function displayColor() {
    let temp = '';
    (options.colors).forEach(i => temp += `<li class="customizer__color" style="background-color: ${i};" data-swatch="${i}" title="${i}">&nbsp;</li>`)
    return temp
}

function swatchAttachHandler(elements) {
    for(let i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', swatchHandler)
    }
}

function swatchHandler(e) {
    chosenColor = e.target.getAttribute('data-swatch')
}

function pathFill(e) {
    if (e.target.tagName !== 'path') return
    e.target.addEventListener('click', fillHandler)
}

function fillHandler(e) {
    if (chosenColor === '') return
    // console.log('fill path with', chosenColor)
    // console.log(e.target)
    e.target.style.fill = chosenColor
}

// prepare image
const customizerBtn = document.getElementById('prepImage')
customizerBtn.addEventListener('click', prepCustomizedImageHandler)

function prepCustomizedImageHandler(e) {
    e.preventDefault(); 
    console.log(e.target)

    const modalBtn = document.getElementById("confirmation_modal")
    if (!(modalBtn.checked)) modalBtn.setAttribute('checked', true)

    generateImage()
}

function generateImage() {
    const svg = document.getElementById('ActivityDIV').firstElementChild
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
}

const submitRequestBtn = document.getElementById('email_submit')
submitRequestBtn.addEventListener('click', submitRequestAQuote)

async function submitRequestAQuote(e) {
    e.preventDefault();
    document.getElementById('image_url').value = output
    
    let formData = new FormData(e.target.parentElement)
    let dataToServer = {}
    for (const [key, value] of formData) {
        if(value === '') return alert(`${key} field cannot be blank`)
        dataToServer[key] = value
    }

    Email.send({
        SecureToken : "accbd6c4-fc43-4951-926e-4844b01c06e4",
        To : dataToServer["email"],
        From : 'jtzuya@gmail.com',
        Subject : "Product Customize",
        Body : `Give me a quote on this custom image <br> <img src=\"${output}\" /> <br> and send it to ${dataToServer["email"]}`
    }).then(message => alert(message));
}

swatchAttachHandler(document.getElementsByClassName('customizer__color'))