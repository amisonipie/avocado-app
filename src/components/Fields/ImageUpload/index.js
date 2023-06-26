import React from "react";

const ImageUpload = React.forwardRef(({ type, placeholder, ...props }, ref) => {
  return <h1>Image Upload</h1>;
});

export default ImageUpload;

// import React from "react";
// import { useRef, useState, useEffect } from "react";
// import styles from './ImageUpload.module.css'
// const ImageUpload = React.forwardRef(({ type, placeholder, ...props }, ref) => {
//   const [image, setImage] = useState();
//   const [preview, setPreview] = useState();
//   const fileInputRef = useRef();

//   useEffect(() => {
//     if (image) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreview(reader.result);
//       };
//       reader.readAsDataURL(image);i54
//     } else {
//       setPreview(null);
//     }
//   }, [image]);

//   return (
//     <div>
//       <form>
//         {preview ? (

//           <img
//             src={preview}
//             style={{ objectFit: "cover" , width: "200px"}}
//             onClick={() => {
//               setImage(null);
//             }}
//           />
//         ) : (

//           <button
//           className="upload"
//             onClick={(event) => {
//               event.preventDefault();
//               fileInputRef.current.click();
//             }}
//           >
//             Add Image
//           </button>
//         )}
//         <input
//           type="file"
//           style={{ display: "none" }}
//           ref={fileInputRef}
//           accept="image/*"
//           onChange={(event) => {
//             const file = event.target.files[0];
//             if (file && file.type.substr(0, 5) === "image") {
//               setImage(file);
//             } else {
//               setImage(null);
//             }
//           }}
//         />
//       </form>
//     </div>
//   );
// });

// export default ImageUpload;
