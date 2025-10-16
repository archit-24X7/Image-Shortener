const uploadbox = document.querySelector(".upload-box"),
      previewimg = document.querySelector("img"),
      fileinput = uploadbox.querySelector("input"),
      sizeinput = document.querySelector(".size input"),
      ratioinput = document.querySelector(".ratio input"),
      qualityinput = document.querySelector(".quality input"),
      downloadbtn = document.querySelector(".download-btn");

let original_img_ratio;
let imgFile;

const loadfile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    imgFile = file;
    previewimg.src = URL.createObjectURL(file);
    previewimg.addEventListener("load", () => {
        original_img_ratio = previewimg.naturalWidth / previewimg.naturalHeight;
        document.querySelector(".wrapper").classList.add("active");
    });
};

const ResizeAndDownload = () => {
    const targetSizeKB = sizeinput.value;  // User input for target file size (in KB)
    if (!targetSizeKB) return alert("Please enter a target file size.");

    const canvas = document.createElement("canvas");
    const a = document.createElement("a");
    const context = canvas.getContext("2d");

    // Start with an initial quality and resize factor
    let quality = 1.0;
    let width = previewimg.naturalWidth;
    let height = previewimg.naturalHeight;

    const compressImage = (qualityFactor) => {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(previewimg, 0, 0, canvas.width, canvas.height);

        // Check the file size of the image and adjust quality
        const dataURL = canvas.toDataURL("image/jpeg", qualityFactor);
        const byteLength = atob(dataURL.split(",")[1]).length;

        // Convert byte length to KB
        const fileSizeKB = byteLength / 1024;

        if (fileSizeKB <= targetSizeKB) {
            a.href = dataURL;
            a.download = new Date().getTime();
            a.click();
        } else if (qualityFactor > 0.1) {
            // Reduce quality and try again
            quality = qualityFactor - 0.1;
            compressImage(quality);
        } else {
            alert("Could not compress to target size.");
        }
    };

    // Start compression with a high quality setting
    compressImage(quality);
};

downloadbtn.addEventListener("click", ResizeAndDownload);
fileinput.addEventListener("change", loadfile);
uploadbox.addEventListener("click", () => fileinput.click());
