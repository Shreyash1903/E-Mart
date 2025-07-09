import axios from 'axios';
import Swal from 'sweetalert2';

const useOrder = () => {
  const placeOrder = async ({ addressId, cartItems, total }) => {
    const token = localStorage.getItem('access_token');

    const orderData = {
      address: addressId,
      total_price: total,
      items: cartItems.map(item => ({
        product: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      await axios.post("http://localhost:8000/api/orders/create/", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return true;
    } catch (error) {
      console.error("Order placement failed:", error);
      Swal.fire({
        icon: 'error',
        title: 'Order Failed',
        text: 'Order placement failed. Please try again.',
        confirmButtonColor: '#d33',
      });
      return false;
    }
  };

  return { placeOrder };
};

export default useOrder;
