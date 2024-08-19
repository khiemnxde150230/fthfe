  export const encodeId = (id) => {
    return btoa(id);
  };
  
  export const decodeId = (encodedId) => {
    try {
      return atob(encodedId);
    } catch (e) {
      console.error('Invalid encoded ID');
      return null;
    }
  };
  