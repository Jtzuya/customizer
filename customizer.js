(function( $ ) {
  
    console.clear()
    console.log('svgColor')
    
    var mainHolder, colorHolder
    var btnRandom, btnClear, btnDownloadSVG, btnDownloadPNG
    var svgObject, svgOutline, svgColor, output
    var swatchUp, swatchDown
    var fillSpeed = 0.15
    var chosenColor = '#FFFFFF'
    var colors = [
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

    var svgAssets = [
        {'src' : './images/Asym_1_36m2.svg'},
        {'src' : './images/Asym_2_43m2.svg'},
        {'src' : './images/Asym_3_50m2.svg'},
        {'src' : './images/Asym_4_57m2.svg'},
        {'src' : './images/Asym_5_65m2.svg'},
        {'src' : './images/Asym_6_75m2.svg'},
        {'src' : './images/Asym_7_82m2.svg'},
        {'src' : './images/Asym_8_93m2.svg'},
        {'src' : './images/Asym_9_105m2.svg'},
        {'src' : './images/Asym_10_118m2.svg'},
        {'src' : './images/Asym_11_133m2.svg'},
        {'src' : './images/Asym_12_148m2.svg'},
        {'src' : './images/Asym_13_165m2.svg'},
        {'src' : './images/Asym_14_183m2.svg'},
        {'src' : './images/Asym_15_203m2.svg'},
        {'src' : './images/Asym_16_223m2.svg'},
        {'src' : './images/Asym_17_243m2.svg'},
        {'src' : './images/Asym_18_265m2.svg'},
        {'src' : './images/Asym_A_28m2.svg'},
        {'src' : './images/Asym_B_32m2.svg'},
    ]
    
    var chosenSVG = svgAssets[0].src

    var closeOffset

    function swatchClick(){
        if($(this).attr('data-color') === null) return
        $('.label-color').html($(this).attr('data-color-name'))

        chosenColor = $(this).attr('data-color')
        console.log(chosenColor)
        TweenMax.to(colorHolder, fillSpeed, { backgroundColor: chosenColor })
    }

    function swatchMove(e){
        var moveTo = (e.type == 'mouseenter')? swatchUp: swatchDown;
        TweenMax.to('.swatchHolder', 0.5, moveTo);
    }
    
    function colorMe() {
        TweenMax.to(this, fillSpeed, { fill: chosenColor });
    }

    function colorRollover(e){
        var rollover = (e.type == 'mouseenter')? {scale:1.2}:{scale:1};
        TweenMax.to($(this), 0.05, rollover); 
    }
    
    function download(){
        var svgInfo = document.querySelector('svg').outerHTML
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(svgInfo,"text/xml");
        var dl = document.createElement("a");
        document.body.appendChild(dl); // This line makes it work in Firefox.
        dl.setAttribute("href", "data:image/svg+xml;base64,"+xmlDoc);
        dl.setAttribute("download", "test.svg");
        dl.click();
    }

    function svgClear() {
        $(svgColor).each(function(){
            TweenMax.to(this, fillSpeed, { fill: "#FFF" });
        })
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

        setTimeout(() => { 
            // <a href="your_link" download> file_name </a>
            // console.log(output) 
            // console.log(window.location)
            // debugBase64(output)
            dataURIToBlob(output, blobCallback)
            // window.open(output, '_blank')
        }, 500)
    }

    // edited from https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob#Polyfill
    function dataURIToBlob(dataURI, callback) {
        var binStr = atob(dataURI.split(',')[1]),
        len = binStr.length,
        arr = new Uint8Array(len);
    
        for (var i = 0; i < len; i++) {
            arr[i] = binStr.charCodeAt(i);
        }
    
        callback(new Blob([arr]));
    }
    
    var blobCallback = function(blob) {
        var downloadBtn = document.createElement('a');
        downloadBtn.download = 'customized-output.png';
        // the string representation of the object URL will be small enough to workaround the browser's limitations
        downloadBtn.href = URL.createObjectURL(blob);
        // you must revoke the object URL, 
        //   but since we can't know when the download occured, we have to attach it on the click handler..

        downloadBtn.click();
    };

    function changeVariantImage() {
        chosenSVG = $(this).attr('data-src')
        
        // click event to change the current displayed SVG
        $('#ActivityDIV').makeSVGcolor(chosenSVG)
        $('.label-variant').text($(this).attr('data-variant-name'))
        // console.log(this)
    }

    function svgDownloadSVG() {
        var svgInfo = $(svgObject).clone();
        console.clear()
        console.log(svgInfo)
        console.log(svgInfo)
        $(this).attr({
                href:"data:image/svg+xml;base64,"+svgInfo.toString(),
                download:'output.svg',
                target:"_blank"
        });
    }

    function svgDownloadPNG() {
        // Future expantion:
        // Look at https://bl.ocks.org/biovisualize/8187844
    }

    $.fn.setupVariants = function() {
        let parentTag = this

        // convert object to array

        $.each(svgAssets, function() {
            var variantTag = $('<li></li>')

            var variantText = (this.src).split('./images/')[1].split('_').join(' ').split('.')[0]

            $(variantTag).addClass('menu__item')
            $(variantTag).html(variantText)
            $(variantTag).attr('data-src', this.src)
            $(variantTag).attr('data-variant-name', variantText)
            $(variantTag).on('click', changeVariantImage)

            parentTag.append(variantTag)
        })
    }

    $.fn.setupSwatches = function() {
        let parentTag = this

        $.each(colors, function() {
            var swatchTags = $('<li><li/>')
            var swatchTag = swatchTags[0]
            
            let swatchNameTag = $('<span></span>')

            $(swatchTag).addClass('customizer__color')
            $(swatchNameTag).addClass('customizer__color-name')
            $(swatchNameTag).text(this.name)

            $(swatchTag).attr('title', this.name)
            $(swatchTag).attr('data-color', this.color)
            $(swatchTag).attr('data-color-name', this.name)

            $(swatchTag).css('background-color', this.color)

            $(swatchTag).html(swatchNameTag)
            
            $(swatchTag).on('click', swatchClick)
            $(swatchTag).on('mouseenter mouseleave', colorRollover)
            parentTag.append(swatchTag)
        })
    }
    
    $.fn.makeSVGcolor = function(svgURL) {
        mainHolder = this
        $(this).load(svgURL, function() {
            svgObject  = $('svg', this)
            svgColor   = $('path')

            $(svgColor).on('click', colorMe)
            $('.swatchHolder').addClass('gray')
        });
    }

    $.fn.btnClear     = function() {
        btnClear = this
        $(btnClear).on('click', svgClear)
    }

    $.fn.btnDownload  = function(type) {
        if(type == 'PNG'){
            btnDownloadPNG = this
            $(this).on('mouseenter', svgDownloadPNG)
        } else {
            btnDownloadSVG = this
            $(this).on('mouseenter', svgDownloadSVG)
        }
    }

    $.fn.btnDownload2 = function() {
        btnClear = this
        $(btnClear).on('click', download)
    }

    // $.fn.downloadImage = function() {
    //     generateImage()
    // }

    $('#ActivityDIV'   ).makeSVGcolor(chosenSVG)
    $('#btnClear'      ).btnClear()
    // $('#prepImage').btnDownload()
    $('#prepImage').on('click', generateImage)
    $('#btnDownloadSVG2').btnDownload2()
    
    $(document).ready(function () {
        // variants setup
        $('.menu__extension').setupVariants()

        // color setup
        $('.customizer__colors').setupSwatches()
    })
}( jQuery ));