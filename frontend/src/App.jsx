import { useState } from "react";
import axios from 'axios'; //axios is used to make HTTP requests to the backend server. It allows the frontend to send data (the URL to be shortened) and receive responses (the shortened URL and QR code) from the backend API.
import QRCode from 'react-qr-code'; //react-qr-code is a library that provides a React component for generating QR codes. It allows the frontend to display the QR code corresponding to the shortened URL, making it easy for users to scan and access the original URL.
import QRCodeGenerator from 'qrcode'; //qrcode is a library that can generate QR codes in various formats. It is likely used in the backend to create the QR code image for the shortened URL, which is then sent back to the frontend for display.


const API_BASE_URL = import.meta.env.VITE_BACKEND_URL; //import.meta used to access environment variables in a Vite project. Here, it retrieves the value of VITE_BACKEND_URL from the .env file, which is the base URL for the backend API. This allows the frontend to make requests to the correct server endpoint for URL shortening and QR code generation.

function App() {
  const [url, setUrl] = useState(""); //useState hook is used to manage the state of the URL input field. It initializes the url state variable to an empty string and provides a setUrl function to update it when the user types in the input field.
  const [shortUrl, setShortUrl] = useState(""); //useState hook is used to manage the state of the shortened URL. It initializes the shortUrl state variable to an empty string and provides a setShortUrl function to update it when the shortened URL is generated.
  const [copied, setCopied] = useState(false); 
  const [qrImage, setQrImage] = useState("");

  const handleShorten = async () =>{
    if(!url) return; // If the url state variable is empty (i.e., the user hasn't entered a URL), the function will return early and not proceed with the shortening process.

    try {
        const res = await axios.post(`${API_BASE_URL}/shorten`, {
          originalUrl: url,
        }); // This line sends a POST request to the backend API at the /shorten endpoint, passing the original URL as data in the request body. The backend will process this request, generate a shortened URL and a QR code, and return them in the response.
    
        const newShortUrl = res.data.shortUrl; // This line extracts the shortened URL from the response data and stores it in the newShortUrl variable.
        setShortUrl(newShortUrl); // this line updates the shortUrl state variable with the newly generated shortened URL, which can then be displayed to the user.

        setCopied(false); // This line resets the copied state variable to false, indicating that the shortened URL has not been copied to the clipboard yet. This is likely used to manage the UI state for a "Copy" button or similar functionality.
      
      
        const qr = await QRCodeGenerator.toDataURL(newShortUrl); //creates a QR code image in the form of a data URL (a base64-encoded string representing the image) for the newly generated shortened URL. This allows the frontend to display the QR code corresponding to the shortened URL.
        setQrImage(qr); // This line updates the qrImage state variable with the generated QR code image, allowing it to be displayed in the UI.


      } catch (err) {
      console.log(err);
      alert("Failed to shorten the URL. Please try again.");
    }
  }

  
  return <div>Shortly - URL Shortener & QR Code Generator
    
  </div>
}

export default App;