const key = "user";

const storeUser = async (userData) => {
  try {
    await localStorage.setItem(key, JSON.stringify(userData));
  } catch (error) {
    console.log("Error storing the user data", error);
    return null;

  }
};

export const getUser = async () => {
  try {
    const storedUser = await localStorage.getItem(key);
    return ((storedUser) ? JSON.parse(storedUser) : null);
  } catch (error) {
    console.log("Error getting the auth token", error);
    return null;
  }
};

export const getToken = async () => {
  //console.log("Getting.....");
  const storedUser = await getUser();
  return storedUser ? storedUser.JWT_Token : null;
};

const deleteUser = async () => {
  try {
    await localStorage.removeItem(key);
  } catch (error) {
    console.log("Error removing the auth token", error);
    return null;

  }
};

const storeCart = async (cart) => {
  try {
    await localStorage.setItem('fadi-cart', JSON.stringify(cart));
  } catch (error) {
    console.log("Error storing the auth token", error);
  }
};

const getCart = async () => {
  try {
    return await localStorage.getItem('fadi-cart');
  } catch (error) {
    console.log("Error getting the auth token", error);
    return [];
  }
};

const storeWishlist = async (wishlist) => {
  try {
    await localStorage.setItem('fadi-wishlist', JSON.stringify(wishlist));
  } catch (error) {
    console.log("Error storing the auth token", error);
  }
};

const getWishlist = async () => {
  try {
    return await localStorage.getItem('fadi-wishlist');
  } catch (error) {
    console.log("Error getting the auth token", error);
    return [];

  }
};

export default { storeCart, getCart, storeWishlist, getWishlist, storeUser, getUser, getToken, deleteUser };
