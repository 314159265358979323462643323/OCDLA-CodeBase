var element = document.querySelector('.modal.container.arrow');
var styles = window.getComputedStyle(element,'::before');
var left = styles['left'];
console.log(left);




function getRules() {

    var stylesheet = document.styleSheets[3];
    stylesheet.cssRules[2].style.left = 135;
    for (var i = 0; i<document.styleSheets.length; i++) {
     var ss = document.styleSheets[i];
     var r = ss.cssRules ? ss.cssRules : ss.rules;
     console.log(r);
    }
    
    
}