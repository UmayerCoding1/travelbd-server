import multer from "multer";
const storage = multer.diskStorage({
    destination : (req,file,cd) => {
        
        cd(null, '../public/upload');
    },
    filename: (req,file,cd) => {
        cd(null, `travelBD-${file.fieldname}-${file.originalname}`)
    }
});

export const upload = multer({storage});