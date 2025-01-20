export async function uploadImage(file) {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);
  data.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: data,
      }
    );
    const result = await response.json();
    return { secure_url: result.secure_url, public_id: result.public_id }; // Zwraca URL obrazu
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

export async function deleteImage(public_id) {
  const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/destroy`;

  const data = {
    public_id: public_id,
    api_key: process.env.REACT_APP_CLOUDINARY_API_KEY, // Tylko API Key, nie API Secret
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.result === "ok") {
      console.log("Image deleted successfully!");
    } else {
      console.error("Failed to delete image:", result);
    }
  } catch (error) {
    console.error("Error deleting image:", error);
  }
}
