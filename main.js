import { GoogleGenerativeAI } from '@google/generative-ai';
import md from "markdown-it";

  const genAiApi = new GoogleGenerativeAI(`${import.meta.env.VITE_GEMINI_API}`);
  const model = genAiApi.getGenerativeModel({model:"gemini-pro"});

// Define a variable to hold the extracted text
let extractedText = '';

const button = document.getElementById("QCM");

button.addEventListener("click", function() {
  const file = document.getElementById('pdf-file').files[0];

  if(file != null){
    
    const animation = document.getElementById('animation');
    animation.style.display='block';
    const reader = new FileReader();

    reader.onload = function() {
      const typedarray = new Uint8Array(this.result);
      pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
        let text = '';
        let promises = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          promises.push(pdf.getPage(i).then(function(page) {
            return page.getTextContent().then(function(content) {
              content.items.forEach(function(item) {
                text += item.str + ' ';
                
              });
            });
          }));
        }

        // Resolve all promises when all page text content is processed
        Promise.all(promises).then(() => {
          extractedText = text; // Assign the extracted text to the variable
        
          async function ai() {
            try {
              // Ensure model.generateContent returns a Promise
              const prompt = 'Donnez-moi 10 questions à choix multiples (QCM) avec 5 propositions à ce cours,mettre le titre du cours au début  ,Je veux que vous fassiez beaucoup de bonnes réponses pour la même question , mettre les reponses juste a la fin, le cours est "  '+ extractedText + '".';

              const message = await model.generateContent(prompt);
        
              // Handle the response object from message.response
              if (message.response) {
                const response = await message.response;
                const text = response.text();
                const paragraph = document.getElementById('paragraph');
                animation.style.display = 'none';
                paragraph.style.display = 'block';
                let md_text = md().render(text);
                paragraph.innerHTML = md_text;
              } else {
                console.error("No response received from model.generateContent");
              }
            } catch (error) {
              console.log(error);
              const paragraph = document.getElementById('paragraph');
              animation.style.display = 'none';
              paragraph.style.display = 'block';
              paragraph.innerHTML = "An error has occurred, please try again!";
            }
          }
        
          ai(); // Call the ai function after Promise.all resolves
        });
        
      });
    };
    console.log(extractedText);
    reader.readAsArrayBuffer(file);
    
    

  }else{
    const errorPdf = document.getElementById('noFile');
    errorPdf.innerHTML = 'please enter your file';
  }
});



// GENERATE CAS CLINIQUE



const casClinique = document.getElementById("casClinique");

casClinique.addEventListener("click", function() {
  const file = document.getElementById('pdf-file').files[0];

  if(file != null){
    
    const animation = document.getElementById('animation');
    animation.style.display='block';
    const reader = new FileReader();

    reader.onload = function() {
      const typedarray = new Uint8Array(this.result);
      pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
        let text = '';
        let promises = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          promises.push(pdf.getPage(i).then(function(page) {
            return page.getTextContent().then(function(content) {
              content.items.forEach(function(item) {
                text += item.str + ' ';
              });
            });
          }));
        }
        
        // Resolve all promises when all page text content is processed
        Promise.all(promises).then(() => {
          extractedText = text; // Assign the extracted text to the variable
        
          async function ai() {
            try {
              // Ensure model.generateContent returns a Promise
              const prompt = 'Donnez-moi des cas cliniques à ce cours ,mettre le titre du cours au début  ,Je veux que vous fassiez beaucoup de bonnes réponses pour la même question , mettre les reponses juste a la fin, le cours est "  '+ extractedText + '".';
 
              const message = await model.generateContent(prompt);
        
              // Handle the response object from message.response
              if (message.response) {
                const response = await message.response;
                const text = response.text();
                const paragraph = document.getElementById('paragraph');
                animation.style.display = 'none';
                paragraph.style.display = 'block';
                let md_text = md().render(text);
                paragraph.innerHTML = md_text;
              } else {
                console.error("No response received from model.generateContent");
              }
            } catch (error) {
              console.log(error);
              const paragraph = document.getElementById('paragraph');
              animation.style.display = 'none';
              paragraph.style.display = 'block';
              paragraph.innerHTML = "An error has occurred, please try again!";
            }
          }
        
          ai(); // Call the ai function after Promise.all resolves
        });
      });
    };

    reader.readAsArrayBuffer(file);
   
    

  }else{
    const errorPdf = document.getElementById('noFile');
    errorPdf.innerHTML = 'please enter your file';
  }
});





