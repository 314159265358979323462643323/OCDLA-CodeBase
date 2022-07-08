const currentLinks = document.querySelectorAll(".ors-link");

for (let i = 0; i < currentLinks.length; i++) {
    currentLinks[i].addEventListener("click", doTheThing);
}


function doTheThing(e) {
    let target = e.target;
    let id = target.id;
    let parts = id.split("-");
    console.log(parts);
    let chapter = parts[0];
    let section = parts[1];

    e.preventDefault();
    e.stopPropagation();



     fetch("index.php?chapter=" + chapter)
        .then(function (resp) {
            return resp.arrayBuffer();
        })
        .then(function (buffer) {
            const decoder = new TextDecoder("iso-8859-1");
            return decoder.decode(buffer);
        })
        .then(function (html) {
            modal.renderHtml(html);
        });
 
    fetch("index.php?chapter=" + chapter +"&section=" +section)
        .then(function (resp) {
            return resp.arrayBuffer();
        })
        .then(function (buffer){
            const decoder = new TextDecoder("iso-8859-1");
            return decoder.decode(buffer);
        })
        .then(function (html){
            //initialize the parser
            const parser = new DOMParser();

            //tell the parser to look for html
            const doc = parser.parseFromString(html, "text/html");

            //specify we want the doccument to be whats inside the <body> tags
            doc.querySelector("body");

            //createa nodeList of all the <b> elements in the body
            let headings = doc.querySelectorAll("b");

            //test we are getting the right heading, iterates through the nodeList, logs items that conatin the chapter
            for(let i = 0; i<headings.length; i++){

            if(headings[i].textContent.indexOf(section)!= -1){
                console.log(headings[i].textContent);
                var found = headings[i];
                
            }
            }

            
            modal.renderHtml(found);
            //modal.renderHtml(html);

            /* Prints all the contents of <b> elements as text to the console
            for(let head of headings){                         
                console.log(head.textContent);
            }
            */

            /*
            THESE DONT WORK

            let headings = doc.querySelectorAll("span > b");
            console.log(headings);
            let head = doc.querySelector("style['font-size:12.0pt;font-family:\"Times New Roman\",serif'");
            console.log(head);

            
            let docBody = doc.querySelector("body");
            let headings = docBody.querySelectorAll("<b></b>");
            let heading = docBody.querySelector("<span style=\"font-size:12.0pt;font-family:\"Times New Roman\",serif\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 813.010 Driving under the influence of intoxicants; penalty.</span>")
            

            for(i = 0; i <headings.length; i++)
            modal.renderHtml(headings[i]);
            */
           
        });

    return false;
}


/*
fetch("?chapter=313&section=005")
.then
.then(function(html)) {



    let parser = new DOMParser();
    let doc = parser.parseFromString(html,"text/html");

    doc.querySelector("body");

    // get an array of all section headings:
    let headings = doc.querySelectorAll("b span");


    


}
*/