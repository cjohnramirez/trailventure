export const formatDate = (dateString: string | null | undefined) => {
  // Handle falsy values and the literal "None" string
  if (!dateString || dateString === "None") {
    return ""; 
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return dateString; 
  }

  return date.toISOString().split("T")[0];
};
