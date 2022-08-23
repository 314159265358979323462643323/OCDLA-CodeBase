import { OrsModal } from "../node_modules/@ocdladefense/ors/dist/modal.js";
import { OrsParser } from "../node_modules/@ocdladefense/ors/dist/ors-parser.js";
import {InlineModal} from "../node_modules/@ocdladefense/modal-inline/dist/modal.js";
import {domReady} from "../node_modules/@ocdladefense/system-web/SiteLibraries.js";
import {OrsChapter} from "../node_modules/@ocdladefense/ors/src/chapter.js"

// List for ORS-related requests.
document.addEventListener("click", displayOrs);

window.OrsChapter = OrsChapter;
const cache = {};
let inlineModalFired = false;
// Convert the document to be ORS-ready.
domReady(function() {

    convert();

    window.modalJr = new InlineModal("modal-jr");

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
    const loadingIcon = `<head>
                             <link rel="stylesheet" href="node_modules/@ocdladefense/modal-inline/dist/loading.css" />
                         </head>
                         <div id="loading" class="spinner-border" role="status">
                             <span id="loading-wheel" class="sr-only">Loading...</span>
                         </div>`;
    let modalTarget = window.modalJr.getRoot();
    let links = document.querySelectorAll('a');

    
    let mouseOutCb = getMouseLeaveCallback(modalTarget, function() { window.modalJr.hide(); });
    let mouseOverCb = getMouseOverCallback(function(x,y,chapter,section){
        console.log("rectangle");
        if(inlineModalFired == true)
        {
            return false;
        }
        inlineModalFired = true;

        let chapterDoc = cache[chapter] || new OrsChapter(chapter); 
        if(cache[chapter] == null)
        {
            window.modalJr.show(x,y);
            //window.modalJr.renderHtml(loadingIcon);
            chapterDoc.load().then(function(){

                cache[chapter] = chapterDoc;
                chapterDoc.injectAnchors();
                
                let endSection = chapterDoc.getNextSection(section);
                let cloned = chapterDoc.clone(section, endSection.id);
                let clonedHtml = serializer.serializeToString(cloned);
                window.modalJr.renderHtml(clonedHtml);
                inlineModalFired = false;
            });
        }  
        else
        {
            window.modalJr.show(x,y);
            let endSection = chapterDoc.getNextSection(section);
            let cloned = chapterDoc.clone(section, endSection.id);
            let clonedHtml = serializer.serializeToString(cloned);
            window.modalJr.renderHtml(clonedHtml);
            inlineModalFired = false;
        }
        /*
        chapterDoc.load().then(function(){  
            
        });
        */
    });
    

    modalTarget.addEventListener("mouseleave", mouseOutCb);
    const once = {once: true};
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
}

function getMouseOverCallback(fn) {


    return (function(e) {
        let target = e.target;
        //console.log(e);

        let rectangle = target.getBoundingClientRect();
        let recW = rectangle.width;
        let recH = rectangle.height;

        //need to fix this, doesnt work right
        let x = recW + (rectangle.width - e.pageX);
        let y = e.pageY;
        fn(e.pageX,e.pageY,target.dataset.chapter,target.dataset.section);

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
