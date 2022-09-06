var element = document.querySelector('.modal.container.arrow');
var styles = window.getComputedStyle(element,'::before');
var left = styles['left'];
console.log(left);




function getStyleSheet(name) {

    for (var i = 0; i<document.styleSheets.length; i++) {
        let href = document.styleSheets[i].ownerNode.getAttribute("href");
        if(href.indexOf(name) !== -1)
        {
            console.log("SUCCESS!!");
        }
    }
    
}