export async function getPhotos (event) {
  return {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
};
