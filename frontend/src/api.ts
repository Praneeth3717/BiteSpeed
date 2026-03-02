export interface IdentifyPayload {
  email?: string;
  phoneNumber?: string;
}

export const identifyContact = async (data: IdentifyPayload) => {
  const response = await fetch("https://bitespeed-4pst.onrender.com/identify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong");
  }
  return result;
};