import CancelIcon from "@mui/icons-material/Cancel";
import CropIcon from "@mui/icons-material/Crop";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Slide,
  Slider,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../lib/cropImage";

const zoomPercent = (value) => {
  return `${Math.round(value * 100)}%`;
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ImageCropper = ({ open, onClose, image, setImage, setimgBase64 }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isLoaded, setisLoaded] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const cropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const cropImage = async () => {
    try {
      const {
        base64,
        blob: { url },
      } = await getCroppedImg(image, croppedAreaPixels);
      setimgBase64(base64);
      setImage(url);
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const cropperOverlay = document.getElementsByClassName(
      "reactEasyCrop_CropArea reactEasyCrop_CropAreaGrid"
    )[0];

    if (cropperOverlay) {
      cropperOverlay.style.height = "516px";
      cropperOverlay.style.width = "1029px";
    }
  }, [isLoaded]);

  const handleCancelClick = () => {
    onClose(true);
  };

  const handleCropClick = () => {
    cropImage();
  };

  return (
    <Dialog
      open={open}
      maxWidth="lg"
      fullWidth
      TransitionComponent={Transition}
    >
      <DialogContent
        dividers
        sx={{
          background: "#333",
          position: "relative",
          height: 400,
          width: "auto",
          minWidth: { sm: 500 },
        }}
      >
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onZoomChange={setZoom}
          onCropChange={setCrop}
          onCropComplete={cropComplete}
          onMediaLoaded={() => {
            setisLoaded(true);
          }}
        />
      </DialogContent>
      <DialogActions sx={{ flexDirection: "column", mx: 3, my: 2 }}>
        <Box sx={{ width: "100%", mb: 1 }}>
          <Box>
            <Typography>Zoom: {zoomPercent(zoom)}</Typography>
            <Slider
              valueLabelDisplay="auto"
              valueLabelFormat={zoomPercent}
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e, zoom) => setZoom(zoom)}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={handleCancelClick}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<CropIcon />}
            onClick={handleCropClick}
          >
            Crop
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ImageCropper;
