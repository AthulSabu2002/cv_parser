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

app.get('/user', (req, res) => {
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

// Define functions to extract information using regular expressions or other parsing techniques
function extractName(resumeText) {
    
    const doc = nlp(resumeText);
    const name = doc.people().out('array');
    if (name) {
        return name[0];
      } else {
        return null;
      }
   
  }
  

  

  function extractEmail(resumeText) {
    // Define a regular expression pattern to match email addresses
    const emailRegex = /[\w\.-]+@[\w\.-]+\.\w+/g;
  
    // Find all matches in the text
    const email = resumeText.match(emailRegex);
  
    // If matches are found, return an array of email addresses; otherwise, return null
    if (email) {
      return email;
    } else {
      return null;
    }
  }

  function extractMobile(resumeText) {
    // Define a regular expression pattern to match phone numbers
    const phoneRegex = /(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/g;
  
    // Find all matches in the text
    const phoneMatches = resumeText.match(phoneRegex);
  
    // If matches are found, return an array of phone numbers; otherwise, return null
    if (phoneMatches) {
      return phoneMatches;
    } else {
      return null;
    }
  }

  function extractGender(resumeText) {
    // Define a regular expression pattern to match common gender-related terms
    const genderRegex = /\b(male|female|woman|man|girl|boy)\b/i;
  
    // Find the first match in the text
    const genderMatch = resumeText.match(genderRegex);
  
    // If a match is found, return it; otherwise, return null
    if (genderMatch) {
      return genderMatch[0];
    } else {
      return null;
    }
  }

  function extractQualification(resumeText) {
    // Define an array of common qualification keywords
    const qualificationKeywords = [
      "Bachelor's degree",
      "Master's degree",
      "Ph.D.",
      "MBA",
      "Diploma",
      "Certificate",
      "Bachelor of Science",
      "Bachelor of Arts",
      "Master of Science",
      "Doctorate",
      "Engineering",
      "Computer Science",
      // Add more relevant keywords as needed
    ];
  
    // Initialize an array to store extracted qualifications
    const extractedQualifications = [];
  
    // Look for qualification keywords in the text
    qualificationKeywords.forEach(keyword => {
      const keywordRegex = new RegExp("\\b" + keyword + "\\b", "gi");
      const keywordMatches = resumeText.match(keywordRegex);
  
      if (keywordMatches) {
        extractedQualifications.push(keyword);
      }
    });
  
    // Return the array of extracted qualifications
    if (extractedQualifications.length > 0) {
      return extractedQualifications;
    } else {
      return null;
    }
  }

  function extractCollege(resumeText) {
    // Define an array of common college-related keywords
    const collegeKeywords = [
      "University",
      "College",
      "Institute",
      "School",
      "Academy",
      // Add more relevant keywords as needed
    ];
  
    // Initialize an array to store extracted college names
    const extractedColleges = [];
  
    // Look for college keywords in the text
    collegeKeywords.forEach(keyword => {
      const keywordRegex = new RegExp("\\b" + keyword + "\\b[^,.;]+", "gi");
      const keywordMatches = resumeText.match(keywordRegex);
  
      if (keywordMatches) {
        keywordMatches.forEach(match => {
          // Remove the trailing space and any leading space or punctuation
          const collegeName = match.trim().replace(/^[,.;\s]+/, "");
          extractedColleges.push(collegeName);
        });
      }
    });
  
    // Return the array of extracted college names
    if (extractedColleges.length > 0) {
      return extractedColleges;
    } else {
      return null;
    }
  }

  function extractSpecialization(resumeText) {
    // Define an array of common specialization-related keywords
    const specializationKeywords = [
      "Computer Science",
      "Electrical Engineering",
      "Mechanical Engineering",
      "Civil Engineering",
      "Software Engineering",
      "Biotechnology",
      "Data Science",
      "Artificial Intelligence",
      // Add more relevant keywords as needed
    ];
  
    // Initialize an array to store extracted specializations
    const extractedSpecializations = [];
  
    // Look for specialization keywords in the text
    specializationKeywords.forEach(keyword => {
      const keywordRegex = new RegExp("\\b" + keyword + "\\b", "gi");
      const keywordMatches = resumeText.match(keywordRegex);
  
      if (keywordMatches) {
        keywordMatches.forEach(match => {
          extractedSpecializations.push(match);
        });
      }
    });
  
    // Return the array of extracted specializations
    if (extractedSpecializations.length > 0) {
      return extractedSpecializations;
    } else {
      return null;
    }
  }

  function extractGraduationYear(resumeText) {
    // Define a regular expression pattern to match common date formats indicating years
    const yearRegex = /(\b20\d{2}\b|\b19\d{2}\b)/g;
  
    // Find all matches in the text
    const yearMatches = resumeText.match(yearRegex);
  
    if (!yearMatches) {
      return null;
    }
  
    // Check the context of each date match to identify the graduation year
    for (const yearMatch of yearMatches) {
      const index = resumeText.indexOf(yearMatch);
      const context = resumeText.substring(index - 20, index + 20); // Extract a context of 20 characters around the date.
  
      // Check if the context contains keywords related to graduation
      if (/graduat/i.test(context) || /complet/i.test(context) || /degree/i.test(context)) {
        return yearMatch;
      }
    }
  
    return null;
  }


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


