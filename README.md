# Resume Parser

This is a simple Node.js application that parses resume files in PDF format to extract key information such as name, email, phone number, gender, qualification, college, specialization, and graduation year.

## Prerequisites

Before you get started, ensure you have the following software installed on your machine:

- Node.js
- Express.js
- EJS (for templating)
- pdf-parse (for PDF text extraction)
- compromise (for natural language processing)
- express-fileupload (for handling file uploads)

You can install these dependencies using npm or yarn.

## Usage

1. Clone this repository to your local machine.

2. Install the required dependencies by running:

   ```bash
   npm install



Features
The application provides the following features:

Parsing of resume data from PDF files.
Extraction of key information such as name, email, phone number, gender, qualification, college, specialization, and graduation year.
Displaying the extracted data on a web page.
Code Structure
extractCV.js: Main application file with Express.js setup.
views/: Directory containing EJS templates for rendering HTML.
public/: Directory for serving static assets like CSS.
extractCv.js: Module containing functions for extracting resume data.
README.md: This documentation file.
License
This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgments
The application uses the pdf-parse library to extract text from PDF files.
The compromise library is used for natural language processing.
Feel free to customize and expand this application to suit your specific needs.

If you have any questions or need assistance, please don't hesitate to contact us.