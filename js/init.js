import { OrsModal } from "../node_modules/@ocdladefense/ors/dist/modal.js";
import { OrsParser } from "../node_modules/@ocdladefense/ors/dist/ors-parser.js";
import {InlineModal} from "../node_modules/@ocdladefense/modal-inline/dist/modal.js";
import {domReady} from "../node_modules/@ocdladefense/system-web/SiteLibraries.js";
import {OrsChapter} from "../node_modules/@ocdladefense/ors/src/chapter.js"

// List for ORS-related requests.
document.addEventListener("click", displayOrs);

// For testing in the console.
window.OrsChapter = OrsChapter;

let inlineModalFired = false;

function findStyleSheet(name){
    for (var i = 0; i<document.styleSheets.length; i++) {
        let href = document.styleSheets[i].ownerNode.getAttribute("href");
        if(href.indexOf(name) !== -1)
        {
            console.log("SUCCESS!!");
            return document.styleSheets[i];
        }
    }
}
    

// Convert the document to be ORS-ready.
domReady(function() {

    convert();

    // Inline modal initialization.
    window.modalJr = new InlineModal("modal-jr");

    // Full-screen modal.
    window.modal = new OrsModal();

    const background = document.getElementById("modal-backdrop");

    background.addEventListener("click", function(e) {
        
        let id = e.target.id;
        if(id != "modal-backdrop")
        {
            return;
        }


        modal.hide();
    });
    
    const serializer = new XMLSerializer();

    let modalTarget = window.modalJr.getRoot();
    

    
    let mouseOutCb = getMouseLeaveCallback(modalTarget, function() { window.modalJr.hide(); });
    let mouseOverCb = getMouseOverCallback(function(x,y,chapter,section){
        console.log("X coord is ",x);
        console.log("Y coord is ",y);
        console.log("Chapter is: ",chapter);
        console.log("Section is: ",section);

        // If the modal is already being setup then
        // don't re-initialize.
        if(inlineModalFired == true)
        {
            return false;
        }
        inlineModalFired = true;


        window.modalJr.show(x,y);


        let chapterDoc = OrsChapter.getCached(chapter) || new OrsChapter(chapter); 
        
        

        
        chapterDoc.load().then(function(){              
            let endSection = chapterDoc.getNextSection(section);
            let cloned = chapterDoc.clone(section, endSection.id);
            let clonedHtml = serializer.serializeToString(cloned);
            window.modalJr.renderHtml(clonedHtml);
            inlineModalFired = false;
        });
          
        
    });
    

    modalTarget.addEventListener("mouseleave", mouseOutCb);

    let links = document.querySelectorAll("a[data-action]");

    for(var i = 0; i<links.length; i++) {
        links[i].addEventListener("mouseenter", mouseOverCb);
        links[i].addEventListener("mouseleave", mouseOutCb);
    }

});



function convert() {
    var body = document.querySelector("body");
    
    var text = body.innerHTML;
    var parsed = OrsParser.replaceAll(text);
    // console.log(parsed);

    body.innerHTML = parsed;
}



function displayOrs(e) {
    let target = e.target;

    let action = target.dataset && target.dataset.action;

    // If we aren't showing an ORS then bail.
    if(["show-ors"].indexOf(action) === -1) return false;

    // e.preventDefault();
    // e.stopPropagation();

    let chapter = target.dataset.chapter;
    let section = target.dataset.section;

    let chapterNum = parseInt(chapter);
    let sectionNum = parseInt(section);

    ors(chapterNum, sectionNum);

    return false;
}


function ors(chapter, section) {
     
    // Network call.
    //let network = fetchOrs(chapter,section);
    /*
    let chapterDoc = new OrsChapter(chapter);
    chapterDoc.load().then(function (){
        
        chapterDoc.injectAnchors();
        let endSection = chapterDoc.getNextSection(section);
        chapterDoc.highlight(section, endSection.id);

        let content = chapterDoc.toString();
        //modal.renderHtml(content);
        //modal.show();

        let toc = chapterDoc.buildToC();
        let vols = chapterDoc.buildVolumes();
        modal.show();
        modal.toc(toc);
        modal.titleBar(vols);
        modal.renderHtml(chapterDoc.toString(), "ors-statutes");
    });
    */
    let chapterDoc = OrsChapter.getCached(chapter) || new OrsChapter(chapter);
    chapterDoc.load().then(function() {
        let toc = chapterDoc.buildToc();
        let vols = chapterDoc.buildVolumes();
        modal.show();
        modal.toc(toc);
        modal.titleBar(vols);
        modal.renderHtml(chapterDoc.toString(), "ors-statutes");
    });
}

function moveArrow(position)
{
    const stylesheet = findStyleSheet("modal-inline");
    stylesheet.cssRules[2].style.left = position + "px";
}

function getMouseOverCallback(fn) {


    return (function(e) {
        
        let target = e.target;
        let rectangle = target.getBoundingClientRect();
        let recW = rectangle.width;
        let recY = rectangle.bottom;
        let recR = rectangle.right;
        let center = recR - recW;
        let recH = rectangle.height;
        let screenWidth = window.innerWidth;
        let screenHeight = window.innerHeight;
        let modalWidth = 300;
        let modalHeight = 250;
        let scrollBar = 20;
        let breathingRoom = 15;
        let finalX = center;
        let finalY = e.pageY;

        moveArrow(35);
        //comment
        if (center + modalWidth > screenWidth)
        {
            let valueX = center + modalWidth;
            let difference = (valueX - screenWidth) + scrollBar + breathingRoom;
            finalX = center - difference;
            
            
            moveArrow(215);
        }
        

        
        //dont let the top of the modal overlap the link
        if(e.pageY < recY - 3)
        {
            finalY = e.pageY + recH;   
        }
        //dont let the bottom of the modal go off the screen/window
        if (false && (e.pageY + modalHeight > screenHeight))
        {
            let valueY = y + modalHeight;
            y = valueY + finalHeight;
            console.log(valueY);
        }
        finalX = finalX+1;
        finalY = finalY+1;
        fn(finalX,finalY,target.dataset.chapter,target.dataset.section);

    });
}


function getMouseLeaveCallback(compareNode, fn) {
    return (function(e) {
        let relatedTarget = e.relatedTarget;
        let areTheyEqual = compareNode == relatedTarget;
        console.log("Leave");
        if(areTheyEqual)
        {
            return false;
        }
        if(!compareNode.contains(relatedTarget)){
            fn();
        }
    }); 
}



//Test building Table of Contents
window.tocTest = tocTest;
function tocTest(){
    var chapter = new OrsChapter(813);
    chapter.load().then(function () { 
    chapter.injectAnchors();
    let toc = chapter.buildToC();
    modal.show();
    modal.toc(toc);
    modal.renderHtml(chapter.toString(), "ors-statutes");

    window.location.hash = section; 
    });
}

window.volTest = volTest;
function volTest(){
    var chapter = new OrsChapter(813);
    chapter.load().then(function () { 
        chapter.injectAnchors();
        let toc = chapter.buildToC();
        let vols = chapter.buildVolumes();
        modal.show();
        modal.toc(toc);
        modal.titleBar(vols);
        modal.renderHtml(chapter.toString(), "ors-statutes");
        modal.titleBar(vols);
        
    
        window.location.hash = section; 
        });
    
    
}
