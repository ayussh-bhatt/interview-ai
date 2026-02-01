export const uploadVideoToCloudinary = async (videoBlob) => {
  const formData = new FormData();
  formData.append("file", videoBlob);
  formData.append(
    "upload_preset",
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  );
  formData.append("folder", "interview_responses");

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Cloudinary upload failed");
  }

  return res.json(); // contains secure_url
};
