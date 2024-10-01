const express = require('express');
const fileUpload = require('express-fileupload');
const PDFParser = require('pdf-parse');
const nlp = require('compromise');
const app = express();
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
app.use(express.static('public'));
app.use(bodyParser.json()); 
app.use(express.json());
app.use(fileUpload());

app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // Set EJS as the view engine

app.use((req, res, next) => {
  if (req.url.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css');
  }
  next();
});

app.get('/', (req, res) => {
    res.render('index'); // Renders the 'template.ejs' file with data
});

app.post('/upload', (req, res) => {
  if (!req.files || !req.files.resume) {
      return res.status(400).send('No file uploaded.');
  }
  const resume = req.files.resume;
  
  processResumeData(resume, res);
 
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


// function extractResumeInfo(resumeText) {
//   return {
//     name: extractName(resumeText),
//     email: extractEmail(resumeText),
//     mobileNumber: extractMobile(resumeText),
//     gender: extractGender(resumeText),
//     highestQualification: extractQualification(resumeText),
//     collegeName: extractCollege(resumeText),
//     specialization: extractSpecialization(resumeText),
//     graduationYear: extractGraduationYear(resumeText)
//   };
// }

  function extractName(resumeText) {
    const lines = resumeText.split('\n');
    return lines[2].trim();
  }

  function extractEmail(resumeText) {
    const emailRegex = /\b[\w.-]+@[\w.-]+\.\w{2,4}\b/gi;
    const emails = resumeText.match(emailRegex);
    
    if (emails && emails.length > 0) {
      return emails[0];
    }
    return null;
  }

  function extractMobile(resumeText) {
    const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const phoneMatches = resumeText.match(phoneRegex);
    
    if (phoneMatches) {
      return phoneMatches[0].replace(/\D/g, '');
    }
    return null;
  }

  function extractGender(resumeText) {
    return null;
  }

  function extractQualification(resumeText) {
    const qualificationRegex = /Bachelor of Technology in[^-]+/i;
    const match = resumeText.match(qualificationRegex);
    
    if (match) {
      return match[0].trim();
    }
    return null;
  }

  function extractCollege(resumeText) {
    const lines = resumeText.split('\n');
  

    const keywords = ['college', 'university', 'institute', 'school', 'academy'];
  

    for (let line of lines) {
      const lowerLine = line.toLowerCase();
      if (keywords.some(keyword => lowerLine.includes(keyword))) {

        return line.trim();
      }
    }
  

    const fallbackRegex = /([A-Z][a-z]+(?: [A-Z][a-z]+)*(?:,? (?:College|University|Institute|School|Academy)))/;
    const match = resumeText.match(fallbackRegex);
    
    if (match) {
      return match[1];
    }
  
    return null;
  }

  function extractSpecialization(resumeText) {
    const specializationRegex = /Bachelor of Technology in ([^-]+)/i;
    const match = resumeText.match(specializationRegex);
    
    if (match) {
      return match[1].trim();
    }
    return null;
  }

  function extractGraduationYear(resumeText) {
    const yearRegex = /- July (\d{4})/;
    const match = resumeText.match(yearRegex);
    
    if (match) {
      return match[1];
    }
    return null;
  }


module.exports = {
  extractName,
  extractEmail,
  extractMobile,
  extractGender,
  extractQualification,
  extractCollege,
  extractSpecialization,
  extractGraduationYear
};


  async function processResumeData(resume, res) {
    try {
  
      PDFParser(resume.data).then(data => {
        const resumeText = data.text;
    
        // Perform text extraction and data parsing here
        const uname = extractName(resumeText);
        const email = extractEmail(resumeText);
        const mobile = extractMobile(resumeText);
        const gender = extractGender(resumeText);
        const qualification = extractQualification(resumeText);
        const college = extractCollege(resumeText);
        const specialization = extractSpecialization(resumeText);
        const graduationYear = extractGraduationYear(resumeText);
    
        // You can return the extracted data as a JSON response
        const extractedData = {
          uname,
          email,
          mobile,
          gender,
          qualification,
          college,
          specialization,
          graduationYear,
        };
  
        if(extractedData){
          res.render('form', { extractedData });
        }
        // Print the extracted data to the console
        console.log('Extracted Data:');
        console.log(extractedData);
      });
    

    } catch (error) {
      // Handle errors
      console.error('Error:', error);
      res.status(500).send('Error processing resume data.');
    }
  }


